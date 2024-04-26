import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
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
import { ConfirmationService } from '@skooltrak/ui';
import { Session } from '@supabase/supabase-js';
import { filter, from, map, pipe, switchMap } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  profiles: SchoolUser[];
  schoolId: string | undefined;
  error: unknown | undefined;
  isSigning: boolean;
};

const initialState: State = {
  loading: false,
  user: undefined,
  session: null,
  profiles: [],
  schoolId: undefined,
  error: undefined,
  isSigning: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, profiles, schoolId }) => ({
    userId: computed(() => user()?.id),
    schools: computed(() => [...new Set(profiles().map((x) => x.school))]),
    currentSchool: computed(() =>
      profiles()
        .map((x) => x.school)
        .find((x) => x.id === schoolId()),
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
      { session, user, isSigning, ...state },
      supabase = inject(SupabaseService),
      confirmation = inject(ConfirmationService),
      snackBar = inject(MatSnackBar),
      translate = inject(TranslateService),
      router = inject(Router),
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
        if (!session) {
          patchState(state, { loading: false });

          return;
        }
        patchState(state, { session });
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
                next: (user) => {
                  patchState(state, { user });
                  if (isSigning()) {
                    snackBar.open(
                      translate.instant('WELCOME', { name: user.first_name }),
                    );
                    router.navigate(['/app']);
                  }
                },
                error: (error) => {
                  console.error(error);
                  patchState(state, { error, loading: false });
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
      async signUp(request: SignUpCredentials) {
        patchState(state, { loading: false });
        const { error } = await supabase.signUp(request);
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        confirmation
          .openDialog({
            title: 'Account created',
            description: 'Please, check your email to confirm',
            showCancelButton: false,
            icon: 'heroCheckCircle',
            color: 'tertiary',
          })
          .subscribe();
      },
      async signIn(email: string, password: string) {
        patchState(state, { loading: false });
        const {
          error,
          data: { session },
        } = await supabase.signInWithEmail(email, password);
        if (error) {
          console.error(error);
          snackBar.open(translate.instant(`AUTH_FAILURE.SIGN_IN`));

          return;
        }

        patchState(state, { session, isSigning: true });
      },
      async updateProfile(request: Partial<User>) {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Users)
          .update([request])
          .eq('id', request.id);

        if (error) {
          console.error(error);
          snackBar.open(translate.instant('ALERT.FAILURE'));

          return;
        }

        patchState(state, { user: { ...user()!, ...request }, loading: false });
        snackBar.open(translate.instant('ALERT.SUCCESS'));
      },
      async resetPassword(email: string) {
        const { error } = await supabase.resetPassword(email);
        if (error) {
          console.error(error);
          snackBar.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        snackBar.open(translate.instant('ALERT.SUCCESS'));
      },
      async changePassword(password: string) {
        const { error } = await supabase.updatePassword(password);

        if (error) {
          console.error(error);
          snackBar.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        snackBar.open(translate.instant('ALERT.SUCCESS'));
      },
      async signOut() {
        await supabase.signOut();
        patchState(state, initialState);
        router.navigate(['/']);
        snackBar.open(translate.instant('SIGN_OUT.MESSAGE'));
      },
    }),
  ),
  withHooks({
    onInit({ getSession, getProfiles, getUser, user, session }) {
      getSession();
      getUser(session);
      getProfiles(user);
    },
  }),
);
