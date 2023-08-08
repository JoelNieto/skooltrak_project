import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Table, User } from '@skooltrak/models';
import { catchError, exhaustMap, from, iif, map, mergeMap, of, throwError } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';
import { AuthActions } from './actions';

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

// If token session exists, retrieve User from database and set it
export const setSession = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.setSession),
      mergeMap(({ session }) =>
        iif(
          () => !!session,
          of(session),
          throwError(() => new Error('no session'))
        )
      ),
      exhaustMap((session) =>
        from(
          supabase.client
            .from(Table.Users)
            .select(
              'id, email, first_name, middle_name, father_name, mother_name, avatar_url, updated_at, birth_date, gender'
            )
            .eq('id', session?.user.id)
            .single()
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map((user) => AuthActions.setUser({ user })),
          catchError((error) => of(AuthActions.signInFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const setUser = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.setUser),
      exhaustMap(({ user }) =>
        from(
          supabase.client
            .from(Table.UserProfiles)
            .select('role, school_id, school_name')
            .eq('id', user.id)
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map((roles) => AuthActions.setRoles({ roles }))
        )
      )
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
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(({ request }) =>
        from(
          supabase.client
            .from(Table.Users)
            .update([request])
            .eq('id', request.id)
            .select('*')
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data as unknown as User;
          })
        )
      ),
      map((user) => AuthActions.setUser({ user }))
    );
  },
  { functional: true }
);
