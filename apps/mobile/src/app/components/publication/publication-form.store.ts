import { computed, inject } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import {
  Degree,
  Publication,
  RoleEnum,
  StudyPlan,
  Table,
} from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  degrees: Degree[];
  plans: StudyPlan[];
  error: boolean;
  roles: RoleEnum[];
  selectedPlans: string[];
  selectedDegrees: string[];
  selectedRoles: RoleEnum[];
};

const initialState: State = {
  loading: false,
  degrees: [],
  plans: [],
  error: false,
  roles: Object.values(RoleEnum),
  selectedRoles: [],
  selectedDegrees: [],
  selectedPlans: [],
};

export const PublicationFormStore = signalStore(
  withState(initialState),
  withComputed((_, auth = inject(mobileStore.AuthStore)) => ({
    userId: computed(() => auth.userId()),
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      toastCtrl = inject(ToastController),
      modal = inject(ModalController),
      translate = inject(TranslateService),
    ) => ({
      async publish(request: Partial<Publication>): Promise<void> {
        patchState(state, { loading: true, error: false });

        const { error, data } = await supabase.client
          .from(Table.Publications)
          .insert({
            ...request,
            school_id: state.schoolId(),
            user_id: state.userId(),
          })
          .select(
            'id, title, body, created_at, school_id, user_id, is_public, user:users(id, first_name, father_name, avatar_url)',
          )
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false, error: true });
          const toast = await toastCtrl.create({
            color: 'danger',
            position: 'bottom',
            duration: 2_000,
            message: translate.instant('ALERT.ERROR'),
          });
          toast.present();

          return;
        }

        if (!request.is_public) {
          this.setAudience(data.id);
        }

        const toast = await toastCtrl.create({
          color: 'success',
          position: 'bottom',
          duration: 3_000,
          message: translate.instant('PUBLICATIONS.SUCCESS'),
        });
        toast.present();
        modal.dismiss([data]);
      },

      async setAudience(id: string): Promise<void> {
        if (state.selectedDegrees().length) {
          const items = state
            .selectedDegrees()
            .map((x) => ({ publication_id: id, degree_id: x }));
          const { error } = await supabase.client
            .from(Table.PublicationDegrees)
            .insert(items);
          if (error) {
            console.error(error);
          }
        }

        if (state.selectedPlans().length) {
          const items = state
            .selectedPlans()
            .map((x) => ({ publication_id: id, plan_id: x }));
          const { error } = await supabase.client
            .from(Table.PublicationPlans)
            .insert(items);
          if (error) {
            console.error(error);
          }
        }

        if (state.selectedRoles().length) {
          const items = state
            .selectedRoles()
            .map((x) => ({ publication_id: id, role: x }));
          const { error } = await supabase.client
            .from(Table.PublicationRoles)
            .insert(items);
          if (error) {
            console.error(error);
          }
        }
      },

      async fetchDegrees(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Degrees)
          .select('id, name, level_id, level:levels(id, name, sort)')
          .eq('school_id', state.schoolId())
          .order('level(sort)');

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { degrees: data as unknown as Degree[] });
      },

      async fetchPlans(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.StudyPlans)
          .select(
            'id,name, level:levels(*), level_id, degree_id, degree:school_degrees(*), year, created_at',
            {
              count: 'exact',
            },
          )
          .order('year', { ascending: true });
        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { plans: data as unknown as StudyPlan[] });
      },
    }),
  ),
);
