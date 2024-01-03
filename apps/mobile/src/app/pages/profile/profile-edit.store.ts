import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Gender, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  genders: Gender[];
  loading: boolean;
};

export const ProfileEditStore = signalStore(
  withState({ genders: [], loading: false } as State),
  withMethods(
    (
      { ...state },
      supabase = inject(SupabaseService),
      auth = inject(webStore.AuthStore),
    ) => ({
      async fetchGenders(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Genders)
          .select('id, name');

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { loading: false, genders: data });
      },
      async uploadAvatar(request: File): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.uploadPicture(
          request,
          'avatars',
        );

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        auth.updateProfile({ ...auth.user(), avatar_url: data.path });
        patchState(state, { loading: false });
      },
    }),
  ),
  withHooks({
    onInit({ fetchGenders }) {
      fetchGenders();
    },
  }),
);
