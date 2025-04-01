import { inject } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { RoleEnum, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  role: RoleEnum;
};

export const SchoolConnectorStore = signalStore(
  { protectedState: false }, withState({ loading: false, role: RoleEnum.Student } as State),
  withMethods(
    (
      { role, ...state },
      supabase = inject(SupabaseService),
      translate = inject(TranslateService),
      alertCtrl = inject(AlertController),
      loadingCtrl = inject(LoadingController),
      modalCtrl = inject(ModalController),
      toastCtrl = inject(ToastController),
      navCtrl = inject(NavController),
      auth = inject(mobileStore.AuthStore),
    ) => ({
      async fetchSchoolByCode(code: string): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Schools)
          .select('id,short_name, full_name, crest_url')
          .eq('code', code)
          .single();
        if (error || !data) {
          console.error(error);
          const toast = await toastCtrl.create({
            color: 'danger',
            message: translate.instant('SCHOOL_CONNECTOR.NOT_FOUND'),
            duration: 3000,
            position: 'bottom',
          });
          toast.present();
          patchState(state, { loading: false });

          return;
        }
        const alert = await alertCtrl.create({
          header: data.full_name,
          subHeader: translate.instant('SCHOOL_CONNECTOR.SCHOOL_FOUND'),
          buttons: [
            {
              text: translate.instant('CONFIRMATION.CANCEL'),
              role: 'cancel',
            },
            {
              text: translate.instant('CONFIRMATION.ACCEPT'),
              handler: () => this.addSchoolConnection(data.id),
            },
          ],
        });
        alert.present();
        patchState(state, { loading: false });
      },
      async addSchoolConnection(id: string): Promise<void> {
        const loading = await loadingCtrl.create({
          message: translate.instant('LOADING.WAITING'),
        });
        loading.present();
        const { error } = await supabase.client
          .from(Table.SchoolUsers)
          .insert([{ role: role(), school_id: id }]);

        if (error) {
          console.error(error);
          const toast = await toastCtrl.create({
            color: 'danger',
            position: 'top',
            message: translate.instant('ALERT.FAILURE'),
            duration: 2000,
          });
          toast.present();
          patchState(state, { loading: false });
          loading.dismiss();

          return;
        }
        const toast = await toastCtrl.create({
          color: 'success',
          position: 'top',
          message: translate.instant('SCHOOL_CONNECTOR.SCHOOL_CONNECTED'),
          duration: 2000,
        });
        auth.resetProfiles();
        navCtrl.navigateRoot('/tabs');
        modalCtrl.dismiss();
        loading.dismiss();
        toast.present();
      },
    }),
  ),
);
