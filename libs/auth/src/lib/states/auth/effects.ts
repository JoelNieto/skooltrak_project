import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { messagingState } from '@skooltrak/auth';
import { SchoolUser, Table } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';
import { AlertService } from 'libs/ui/src/lib/services/alert.service';
import {
  catchError,
  EMPTY,
  filter,
  from,
  iif,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';
import { AuthActions } from './actions';
import { AuthStateFacade } from './facade';

// Init Auth State
export const initState = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.initState),
      map(() => AuthActions.getSession()),
    );
  },
  { functional: true },
);

// Get token session (if exists)
export const getSession = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.getSession),
      switchMap(() =>
        supabase.session$.pipe(
          map((SESSION) => AuthActions.setSession({ SESSION })),
        ),
      ),
    );
  },
  { functional: true },
);

export const signUp = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(AuthActions.signUp),
      switchMap(({ REQUEST }) =>
        from(supabase.signUp(REQUEST)).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return EMPTY;
          }),
          map(() => AuthActions.signUpSuccess()),
        ),
      ),
      catchError((ERROR: string) => of(AuthActions.signUpFailure({ ERROR }))),
    );
  },
  { functional: true },
);

export const signUpSuccess = createEffect(
  (actions = inject(Actions), confirmation = inject(ConfirmationService)) => {
    return actions.pipe(
      ofType(AuthActions.signUpSuccess),
      switchMap(() =>
        confirmation.openDialog({
          title: 'Account created',
          description: 'Please, check your email to confirm',
          showCancelButton: false,
          icon: 'heroCheckCircle',
          color: 'green',
        }),
      ),
    );
  },
  { functional: true, dispatch: false },
);

export const getUser = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(AuthStateFacade),
  ) => {
    return actions.pipe(
      ofType(AuthActions.getUser),
      filter(() => !!auth.SESSION()),
      switchMap(() =>
        from(
          supabase.client
            .from(Table.Users)
            .select(
              'id, email, first_name, middle_name, father_name, document_id, mother_name, avatar_url, updated_at, birth_date, gender',
            )
            .eq('id', auth.SESSION()?.user?.id)
            .single(),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map((USER) => AuthActions.setUser({ USER })),
        ),
      ),
    );
  },
  { functional: true },
);

// If token session exists, retrieve User from database and set it
export const setSession = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(AuthActions.setSession),
      switchMap(({ SESSION }) =>
        iif(
          () => !!SESSION,
          of(SESSION),
          throwError(() => new Error('no session')),
        ),
      ),

      map(() => AuthActions.getUser()),
    );
  },
  { functional: true },
);

export const signIn = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    router = inject(Router),
  ) => {
    return actions.pipe(
      ofType(AuthActions.signInEmail),
      switchMap(({ EMAIL, PASSWORD }) =>
        from(supabase.signInWithEmail(EMAIL, PASSWORD)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map(({ session }) => AuthActions.setSession({ SESSION: session })),
          tap(() => router.navigate(['/app'])),
          catchError(() => of(AuthActions.signInFailure({ ERROR: 'SIGN_IN' }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const signOut = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    router = inject(Router),
  ) => {
    return actions.pipe(
      ofType(AuthActions.signOut),
      switchMap(() =>
        from(supabase.signOut()).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return EMPTY;
          }),
          tap(() => router.navigate(['/'])),
          catchError(() => of(AuthActions.signInFailure({ ERROR: 'OTHER' }))),
        ),
      ),
    );
  },
  { functional: true, dispatch: false },
);

export const updateProfile = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    alert = inject(AlertService),
  ) => {
    return actions.pipe(
      ofType(AuthActions.updateProfile),
      switchMap(({ REQUEST }) =>
        from(
          supabase.client
            .from(Table.Users)
            .update([REQUEST])
            .eq('id', REQUEST.id),
        ).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return EMPTY;
          }),
        ),
      ),
      tap(() =>
        alert.showAlert({ icon: 'success', message: 'Profile updated' }),
      ),
      map(() => AuthActions.getUser()),
    );
  },
  { functional: true },
);

export const getProfiles = createEffect(
  (
    actions = inject(Actions),
    messaging = inject(messagingState.MessagingStateFacade),
  ) => {
    return actions.pipe(
      ofType(AuthActions.setUser),
      map(() => AuthActions.getProfiles()),
      tap(() => messaging.getMessages()),
    );
  },
  { functional: true },
);

export const getUserProfiles = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(AuthStateFacade),
  ) => {
    return actions.pipe(
      ofType(AuthActions.getProfiles),
      switchMap(() =>
        from(
          supabase.client
            .from(Table.SchoolUsers)
            .select(
              'user_id, school_id, school:schools(*, country:countries(*)), status, role, created_at',
            )
            .eq('user_id', auth.USER()?.id),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as SchoolUser[];
          }),
          map((PROFILES) => AuthActions.setProfiles({ PROFILES })),
        ),
      ),
    );
  },
  { functional: true },
);

export const setDefaultSchool = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.setProfiles),
      map(({ PROFILES }) =>
        AuthActions.setSchoolId({ SCHOOL_ID: PROFILES[0]?.school_id }),
      ),
    );
  },
  { functional: true },
);

export const signInFailure = createEffect(
  (actions = inject(Actions), alert = inject(AlertService)) => {
    return actions.pipe(
      ofType(AuthActions.signInFailure),
      map(({ ERROR }) =>
        alert.showAlert({ icon: 'error', message: `AUTH_FAILURE.${ERROR}` }),
      ),
    );
  },
  { functional: true, dispatch: false },
);
