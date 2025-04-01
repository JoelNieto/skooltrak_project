import { computed, inject } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ClassGroup, RoleEnum, SchoolUser, SignUpCredentials, Table, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';
import { distinctUntilChanged, filter, map, pipe, tap } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';

type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  profiles: SchoolUser[];
  schoolId: string | undefined;
  group: Partial<ClassGroup> | undefined;
  error: unknown | undefined;
  isSigning: boolean;
};

const initialState: State = {
  loading: false,
  user: undefined,
  session: null,
  profiles: [],
  schoolId: undefined,
  group: undefined,
  error: undefined,
  isSigning: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withComputed(({ profiles, user, schoolId }) => {
    const userId = computed(() => user()?.id);
    const schools = computed(() => [
      ...new Set(profiles().map((x) => x.school)),
    ]);
    const selectedSchool = computed(() =>
      schools().find((x) => x.id === schoolId()),
    );
    const roles = computed(() =>
      profiles()
        .filter((x) => x.school_id === schoolId())
        .map((x) => x.role),
    );
    const isAdmin = computed(() => roles().includes(RoleEnum.Administrator));
    const isTeacher = computed(() => roles().includes(RoleEnum.Teacher));
    const isStudent = computed(() => roles().includes(RoleEnum.Student));
    const currentRole = computed(() => roles()[0]);

    return {
      userId,
      schools,
      roles,
      selectedSchool,
      isAdmin,
      isTeacher,
      isStudent,
      currentRole,
    };
  }),
  withMethods(
    (
      {
        user,
        session,
        error,
        schoolId,
        userId,
        isStudent,
        isSigning,
        ...state
      },
      supabase = inject(SupabaseService),
      toastCtrl = inject(ToastController),
      translate = inject(TranslateService),
      alertCtrl = inject(AlertController),
      navCtrl = inject(NavController),
    ) => {
      async function getSession() {
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
      }
      async function signIn(request: { email: string; password: string }) {
        patchState(state, { loading: true, error: undefined });
        const { email, password } = request;
        const {
          data: { session },
          error,
        } = await supabase.signInWithEmail(email, password);
        if (error) {
          patchState(state, { error, loading: false });

          return;
        }
        if (session === null) {
          patchState(state, { loading: false });

          return;
        }
        patchState(state, { session, loading: false, isSigning: true });
        setTimeout(() => {
          navCtrl.navigateBack(['/']);
        }, 1000);
      }
      async function setUser() {
        const { data, error } = await supabase.client
          .from(Table.Users)
          .select(
            'id, email, first_name, middle_name, father_name, document_id, mother_name, avatar_url, updated_at, birth_date, gender',
          )
          .eq('id', session()?.user?.id)
          .single();

        if (error) {
          patchState(state, { error: error, loading: false });

          return;
        }
        patchState(state, { user: data });
        if (isSigning()) {
          const toast = await toastCtrl.create({
            color: 'success',
            duration: 2000,
            position: 'top',
            translucent: true,
            message: translate.instant('WELCOME', {
              name: data.first_name,
            }),
          });
          toast.present();
        }
      }
      const getUser = rxMethod<Session | null>(
        pipe(
          filter(() => !!session()),
          tap(() => setUser()),
        ),
      );
      async function setProfiles() {
        const { data, error } = await supabase.client
          .from(Table.SchoolUsers)
          .select(
            'user_id, school_id, school:schools(*, country:countries(*)), status, role, created_at',
          )
          .eq('user_id', user()?.id);

        if (error) {
          patchState(state, { error, loading: false, isSigning: false });

          return;
        }

        patchState(state, {
          profiles: data as SchoolUser[],
          schoolId: data[0]?.school_id,
          loading: false,
          isSigning: false,
        });
      }
      const getProfiles = rxMethod<User | undefined>(
        pipe(
          filter(() => !!user()),
          tap(() => setProfiles()),
        ),
      );
      async function signOut() {
        await supabase.signOut();
        patchState(state, initialState);
        const toast = await toastCtrl.create({
          message: translate.instant('AUTH.LOGGED_OUT'),
          position: 'top',
          duration: 2000,
          color: 'primary',
        });
        await toast.present();
      }
      const showError = rxMethod<unknown>(
        pipe(
          filter(() => !!error()),
          distinctUntilChanged(),
          tap(() => console.error(error())),
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
      );
      const setSchool = rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          filter(() => isStudent()),
          tap(() => getGroup()),
        ),
      );

      async function getGroup() {
        const { data, error } = await supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(*), degree:school_degrees(*), group_students!inner(user_id)',
          )
          .eq('group_students.user_id', userId())
          .single();
        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { group: data as unknown as ClassGroup });
      }
      async function signUp(request: SignUpCredentials) {
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
      }
      async function updateProfile(request: Partial<User>) {
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
      }
      async function resetPassword(email: string) {
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
      }
      function resetProfiles() {
        getProfiles(user);
      }

      return {
        getUser,
        getSession,
        getProfiles,
        signIn,
        showError,
        signUp,
        updateProfile,
        resetPassword,
        resetProfiles,
        signOut,
        setUser,
        setProfiles,
        setSchool,
        getGroup,
      };
    },
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
      setSchool,
      schoolId,
    }) {
      getSession();
      getUser(session);
      getProfiles(user);
      showError(error);
      setSchool(schoolId);
    },
  }),
);
