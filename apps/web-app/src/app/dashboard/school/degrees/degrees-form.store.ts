import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Level, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

type State = {
  loading: boolean;
  levels: Partial<Level>[];
};

const initialState: State = {
  loading: false,
  levels: [],
};

export const DegreesFormStore = signalStore(
  withState(initialState),
  withMethods((state, supabase = inject(SupabaseService)) => ({
    async fetchLevels(): Promise<void> {
      patchState(state, { loading: true });
      const { data, error } = await supabase.client
        .from(Table.Levels)
        .select('id, name')
        .order('sort');

      if (error) {
        console.error(error);
        patchState(state, { loading: false });

        return;
      }
      patchState(state, { levels: data, loading: false });
    },
  })),
  withHooks({
    onInit({ fetchLevels }) {
      fetchLevels();
    },
  }),
);
