import { computed, inject } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import {
  RoleEnum,
  SchoolUser,
  SignUpCredentials,
  Table,
  User,
} from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';
import { distinctUntilChanged, filter, from, map, pipe, switchMap } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';

type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  profiles: SchoolUser[];
  schoolId: string | undefined;
  error: unknown | undefined;
};

const initialState: State = {
  loading: false,
  user: undefined,
  session: null,
  profiles: [],
  schoolId: undefined,
  error: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ profiles, user, schoolId }) => ({
    userId: computed(() => user()?.id),
    schools: computed(() => [...new Set(profiles().map((x) => x.school))]),
    selectedSchool: computed(() =>
      [...new Set(profiles().map((x) => x.school))].find(
        (x) => x.id === schoolId(),
      ),
    ),
    roles: computed(() =>
      profiles()
        .filter((x) => x.school_id === schoolId())
        .map((x) => x.role),
    ),
    isAdmin: computed(() =>
      profiles()
        .filter((x) => x.school_id === schoolId())
        .map((x) => x.role)
        .includes(RoleEnum.Administrator),
    ),
    isTeacher: computed(() =>
      profiles()
        .filter((x) => x.school_id === schoolId())
        .map((x) => x.role)
        .includes(RoleEnum.Teacher),
    ),
    isStudent: computed(() =>
      profiles()
        .filter((x) => x.school_id === schoolId())
        .map((x) => x.role)
        .includes(RoleEnum.Student),
    ),
  })),
  withMethods(
    (
      { user, session, error, ...state },
      supabase = inject(SupabaseService),
      toastCtrl = inject(ToastController),
      translate = inject(TranslateService),
      alertCtrl = inject(AlertController),
      navCtrl = inject(NavController),
    ) => ({
      async getSession() {
        patchState(state, { loading: true });
        const {
          data: { session },
          error,
        } = await supabase.client.auth.getSession();
        if (error) {
          console.error(error);
          patchState(state, { error, loading: false });

          return;
        }

        if (session === null) {
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { session });
      },
      async signIn(request: { email: string; password: string }) {
        patchState(state, { loading: true, error: undefined });
        const { email, password } = request;
        const {
          data: { session },
          error,
        } = await supabase.signInWithEmail(email, password);
        if (error) {
          console.error(error);

          patchState(state, { error, loading: false });

          return;
        }
        if (session === null) {
          patchState(state, { loading: false });

          return;
        }
        patchState(state, { session, loading: false });
        await navCtrl.navigateBack(['/']);
      },
      getUser: rxMethod<Session | null>(
        pipe(
          filter(() => !!session()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Users)
                .select(
                  'id, email, first_name, middle_name, father_name, document_id, mother_name, avatar_url, updated_at, birth_date, gender',
                )
                .eq('id', session()?.user?.id)
                .single(),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data;
              }),
              tapResponse({
                next: (user) => patchState(state, { user }),
                error: (error) => {
                  patchState(state, { error });
                  console.error(error);
                },
              }),
            ),
          ),
        ),
      ),
      getProfiles: rxMethod<User | undefined>(
        pipe(
          filter(() => !!user()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.SchoolUsers)
                .select(
                  'user_id, school_id, school:schools(*, country:countries(*)), status, role, created_at',
                )
                .eq('user_id', user()?.id),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as SchoolUser[];
              }),
              tapResponse({
                next: (profiles) =>
                  patchState(state, {
                    profiles,
                    schoolId: profiles[0].school_id,
                  }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      async signOut() {
        await supabase.signOut();
        patchState(state, initialState);
        const toast = await toastCtrl.create({
          message: translate.instant('AUTH.LOGGED_OUT'),
          position: 'top',
          duration: 2000,
        });
        await toast.present();
      },
      showError: rxMethod<unknown>(
        pipe(
          filter(() => !!error()),
          distinctUntilChanged(),
          map(async () => {
            const toast = await toastCtrl.create({
              color: 'danger',
              message: translate.instant('AUTH.WRONG_CREDENTIALS'),
              duration: 2000,
              position: 'top',
            });
            await toast.present();
          }),
        ),
      ),
      async signUp(request: SignUpCredentials) {
        patchState(state, { loading: true });
        const { error } = await supabase.signUp(request);
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        const alert = await alertCtrl.create({
          header: translate.instant('SIGN_UP.ACCOUNT_CREATED'),
          message: translate.instant('SIGN_UP.CONFIRM_EMAIL'),
          buttons: ['OK'],
        });

        await alert.present();
        navCtrl.navigateBack(['/auth']);
      },
      async updateProfile(request: Partial<User>) {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Users)
          .update([request])
          .eq('id', request.id);

        if (error) {
          console.error(error);
          const toast = await toastCtrl.create({
            color: 'danger',
            message: translate.instant('ALERT.FAILURE'),
            duration: 2000,
            position: 'top',
          });
          await toast.present();

          return;
        }

        patchState(state, { user: { ...user()!, ...request }, loading: false });
        const toast = await toastCtrl.create({
          color: 'success',
          message: translate.instant('ALERT.SUCCESS'),
          duration: 1000,
          position: 'top',
        });
        await toast.present();
      },
      async resetPassword(email: string) {
        const { error } = await supabase.resetPassword(email);
        if (error) {
          console.error(error);
          const toast = await toastCtrl.create({
            color: 'danger',
            message: translate.instant('ALERT.FAILURE'),
            duration: 2000,
            position: 'top',
          });
          await toast.present();

          return;
        }
        const toast = await toastCtrl.create({
          color: 'success',
          message: translate.instant('RESET_PASSWORD.SUCCESS'),
          position: 'top',
          duration: 2000,
        });
        await toast.present();
      },
    }),
  ),
  withHooks({
    onInit({
      getSession,
      getUser,
      getProfiles,
      showError,
      session,
      user,
      error,
    }) {
      getSession();
      getUser(session);
      getProfiles(user);
      showError(error);
    },
  }),
);
