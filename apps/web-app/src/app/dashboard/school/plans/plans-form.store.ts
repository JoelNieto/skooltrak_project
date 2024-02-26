import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Degree, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  degrees: Degree[];
};

const initialState: State = { degrees: [] };

export const PlansFormStore = signalStore(
  withState(initialState),
  withComputed((_, auth = inject(webStore.AuthStore)) => ({
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(({ schoolId, ...state }, supabase = inject(SupabaseService)) => ({
    async fetchDegrees(): Promise<void> {
      const { data, error } = await supabase.client
        .from(Table.Degrees)
        .select('id, name, level_id')
        .eq('school_id', schoolId());

      if (error) {
        console.error(error);

        return;
      }
      patchState(state, { degrees: data });
    },
  })),
  withHooks({
    onInit({ fetchDegrees }) {
      fetchDegrees();
    },
  }),
);
