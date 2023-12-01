import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { SchoolUser, Table } from '@skooltrak/models';
import { messagingState } from '@skooltrak/store';
import { catchError, filter, from, iif, map, of, switchMap, tap } from 'rxjs';

import { SupabaseService } from '../../../services/supabase.service';
import { MobileAuthActions as authActions } from './actions';
import { MobileAuthFacade } from './facade';

export const initState = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(authActions.initState),
      map(() => authActions.getSession()),
    );
  },
  { functional: true },
);

export const getSession = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(authActions.getSession),
      switchMap(() =>
        supabase.session$.pipe(
          map((session) => authActions.setSession({ session })),
        ),
      ),
    );
  },
  { functional: true },
);

export const setSession = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(authActions.setSession),
      switchMap(({ session }) =>
        iif(
          () => !!session,
          of(authActions.getUser()),
          of(authActions.signInFailure({ error: 'SIGN_IN' })),
        ),
      ),
    );
  },
  { functional: true },
);

export const signUp = createEffect(
  (actions = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions.pipe(
      ofType(authActions.signUp),
      switchMap(({ request }) =>
        from(supabase.signUp(request)).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
            return;
          }),
          map(() => authActions.signUpSuccess()),
        ),
      ),
      catchError((error) => of(authActions.signInFailure({ error }))),
    );
  },
  { functional: true },
);

export const signInSuccess = createEffect(
  (actions = inject(Actions), toastCtrl = inject(ToastController)) => {
    return actions.pipe(
      ofType(authActions.signInSuccess),
      map(async () => {
        const toast = await toastCtrl.create({
          color: 'success',
          message: 'Account created',
        });

        await toast.present();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const signInFailure = createEffect(
  (
    actions = inject(Actions),
    toastCtrl = inject(ToastController),
    translate = inject(TranslateService),
  ) => {
    return actions.pipe(
      ofType(authActions.signInSuccess),
      map(async () => {
        const toast = await toastCtrl.create({
          color: 'danger',
          message: translate.instant('AUTH_FAILURE.SIGN_IN'),
          duration: 1000,
        });

        await toast.present();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const signIn = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    toastCtrl = inject(ToastController),
  ) => {
    return actions.pipe(
      ofType(authActions.signInEmail),
      switchMap(({ email, password }) =>
        from(supabase.signInWithEmail(email, password)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map(({ session }) => authActions.setSession({ session })),
          tap(async () => {
            const toast = await toastCtrl.create({
              color: 'success',
              message: 'Welcome',
              duration: 500,
            });
            await toast.present();
          }),
          catchError(() => of(authActions.signInFailure({ error: 'OTHER' }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const getUser = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(MobileAuthFacade),
  ) => {
    return actions.pipe(
      ofType(authActions.getUser),
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
          map((user) => authActions.setUser({ user })),
        ),
      ),
    );
  },
  { functional: true },
);

export const getProfiles = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(authActions.setUser),
      map(() => authActions.getProfiles()),
    );
  },
  { functional: true },
);

export const getMessages = createEffect(
  (
    actions = inject(Actions),
    messaging = inject(messagingState.MessagingStateFacade),
  ) => {
    return actions.pipe(
      ofType(authActions.setProfiles),
      map(() => messaging.getMessages()),
    );
  },
  { functional: true, dispatch: false },
);

export const getUserProfiles = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(MobileAuthFacade),
  ) => {
    return actions.pipe(
      ofType(authActions.getProfiles),
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
          map((profiles) => authActions.setProfiles({ profiles })),
        ),
      ),
    );
  },
  { functional: true },
);
