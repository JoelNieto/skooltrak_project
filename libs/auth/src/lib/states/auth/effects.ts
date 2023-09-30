import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchoolUser, Table } from '@skooltrak/models';
import { AlertService } from 'libs/ui/src/lib/services/alert.service';
import { catchError, EMPTY, exhaustMap, filter, from, iif, map, mergeMap, of, tap, throwError } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';
import { AuthActions } from './actions';
import { AuthStateFacade } from './facade';

// Init Auth State
export const initState = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.initState),
      map(() => AuthActions.getSession())
    );
  },
  { functional: true }
);

// Get token session (if exists)
export const getSession = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.getSession),
      exhaustMap(() =>
        supabase.session$.pipe(
          map((session) => AuthActions.setSession({ session }))
        )
      )
    );
  },
  { functional: true }
);

export const getUser = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(AuthStateFacade)
  ) => {
    return actions.pipe(
      ofType(AuthActions.getUser),
      filter(() => !!auth.session()),
      exhaustMap(() =>
        from(
          supabase.client
            .from(Table.Users)
            .select(
              'id, email, first_name, middle_name, father_name, document_id, mother_name, avatar_url, updated_at, birth_date, gender'
            )
            .eq('id', auth.session()?.user?.id)
            .single()
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map((user) => AuthActions.setUser({ user }))
        )
      )
    );
  },
  { functional: true }
);

// If token session exists, retrieve User from database and set it
export const setSession = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(AuthActions.setSession),
      mergeMap(({ session }) =>
        iif(
          () => !!session,
          of(session),
          throwError(() => new Error('no session'))
        )
      ),
      map(() => AuthActions.getUser())
    );
  },
  { functional: true }
);

export const signIn = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.signInEmail),
      exhaustMap(({ email, password }) =>
        from(supabase.signInWithEmail(email, password)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map(({ session }) => AuthActions.setSession({ session })),
          catchError((error) => of(AuthActions.signInFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const updateProfile = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    alert = inject(AlertService)
  ) => {
    return actions.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(({ request }) =>
        from(
          supabase.client
            .from(Table.Users)
            .update([request])
            .eq('id', request.id)
        ).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return EMPTY;
          })
        )
      ),
      tap(() =>
        alert.showAlert({ icon: 'success', message: 'Profile updated' })
      ),
      map(() => AuthActions.getUser())
    );
  },
  { functional: true }
);

export const getProfiles = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(AuthActions.setUser),
      map(() => AuthActions.getProfiles())
    );
  },
  { functional: true }
);

export const getUserProfiles = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(AuthStateFacade)
  ) => {
    return actions.pipe(
      ofType(AuthActions.getProfiles),
      exhaustMap(() =>
        from(
          supabase.client
            .from(Table.SchoolUsers)
            .select(
              'user_id, school_id, school:schools(*, country:countries(*)), status, role, created_at'
            )
            .eq('user_id', auth.user()?.id)
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as SchoolUser[];
          }),
          map((profiles) => AuthActions.setProfiles({ profiles }))
        )
      )
    );
  },
  { functional: true }
);

export const setDefaultSchool = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.setProfiles),
      map(({ profiles }) =>
        AuthActions.setSchoolId({ school_id: profiles[0].school_id })
      )
    );
  },
  { functional: true }
);
