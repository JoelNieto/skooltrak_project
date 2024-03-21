import { computed, inject } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Publication, RoleEnum, Table } from '@skooltrak/models';
import { mobileStore, SupabaseService } from '@skooltrak/store';

type State = {
  loading: boolean;
  error: boolean;
  roles: RoleEnum[];
  selectedRoles: string[];
};

const initialState: State = {
  loading: false,
  error: false,
  roles: Object.values(RoleEnum),
  selectedRoles: Object.values(RoleEnum),
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
            'id, title, body, created_at, school_id, user_id, user:users(id, first_name, father_name, avatar_url)',
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

        this.setAudience(data.id);

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
    }),
  ),
);
