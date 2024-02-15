import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Degree, StudyPlan, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { orderBy } from 'lodash';
import { filter, from, map, pipe, switchMap } from 'rxjs';

type State = {
  loading: boolean;
  degrees: Degree[];
  degreeId: string | undefined;
  plans: Partial<StudyPlan>[];
};

const initialState: State = {
  loading: false,
  degreeId: undefined,
  degrees: [],
  plans: [],
};

export const GroupsFormStore = signalStore(
  withState(initialState),
  withMethods(
    (
      { degreeId, ...state },
      supabase = inject(SupabaseService),
      auth = inject(webStore.AuthStore),
    ) => ({
      async fetchDegrees(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Degrees)
          .select('id, name, level:levels(id, name, sort)')
          .eq('school_id', auth.schoolId());
        if (error) {
          console.error(error);
        }
        patchState(state, {
          degrees: orderBy(data, ['level.sort']) as unknown as Degree[],
        });
        patchState(state, { loading: false });
      },
      fetchPlans: rxMethod<string | undefined>(
        pipe(
          filter(() => !!degreeId()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.StudyPlans)
                .select('id,name')
                .eq('degree_id', degreeId()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data;
              }),
              tapResponse({
                next: (plans) => patchState(state, { plans }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ fetchPlans, fetchDegrees, degreeId }) {
      fetchDegrees();
      fetchPlans(degreeId);
    },
  }),
);
