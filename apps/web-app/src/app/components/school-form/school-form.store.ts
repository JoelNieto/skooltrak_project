import { inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Country, School, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { snakeCase } from 'lodash';

type State = {
  loading: boolean;
  countries: Country[];
  school: Partial<School> | undefined;
  crestUrl: string | undefined;
};

const initialState: State = {
  loading: false,
  countries: [],
  school: undefined,
  crestUrl: undefined,
};

export const SchoolFormStore = signalStore(
  withState(initialState),
  withMethods(
    (
      { school, ...state },
      supabase = inject(SupabaseService),
      translate = inject(TranslateService),
      toast = inject(HotToastService),
    ) => ({
      async fetchCountries(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Countries)
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { countries: data });
      },
      async uploadCrest(request: File): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.uploadPicture(request, 'crests');

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          school: { ...school(), crest_url: data.path },
          loading: false,
        });
      },
      async saveSchool(request: Partial<School>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Schools)
          .upsert([request]);

        if (error) {
          toast.error(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        toast.success(translate.instant('ALERT.SUCCESS'));
        await supabase.createBucket(snakeCase(request.full_name));
        patchState(state, { loading: false });
      },
    }),
  ),
  withHooks({
    onInit({ fetchCountries }) {
      fetchCountries();
    },
  }),
);
