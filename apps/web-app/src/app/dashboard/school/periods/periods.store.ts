import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  periods: Period[];
};

const initialState: State = {
  loading: false,
  periods: [],
};

export const SchoolPeriodsStore = signalStore(
  withState(initialState),
  withComputed((_, auth = inject(webStore.AuthStore)) => ({
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    (
      { schoolId, ...state },
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      fetchPeriods: rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Periods)
                .select('*')
                .eq('school_id', schoolId())
                .order('start_at', { ascending: true }),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as Period[];
              }),
              tapResponse({
                next: (periods) => patchState(state, { periods }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      async savePeriod(request: Partial<Period>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Periods)
          .upsert([{ ...request, school_id: schoolId() }]);

        if (error) {
          alert.showAlert({
            icon: 'error',
            message: 'ALERT.FAILURE',
          });
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        patchState(state, { loading: false });
        this.fetchPeriods(schoolId);
      },
    }),
  ),
  withHooks({
    onInit({ fetchPeriods, schoolId }) {
      fetchPeriods(schoolId);
    },
  }),
);
