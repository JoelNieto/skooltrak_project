import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Degree, Table } from '@skooltrak/models';
import { authState, SupabaseService } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  degrees: Degree[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
};

const initialState: State = {
  degrees: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
};

export const SchoolDegreesStore = signalStore(
  withState(initialState),
  withComputed(({ start, pageSize }) => ({
    end: computed(() => start() + (pageSize() - 1)),
  })),
  withMethods(
    (
      { start, end, ...store },
      auth = inject(authState.AuthStateFacade),
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      fetchDegrees: rxMethod<number>(
        pipe(
          switchMap(() => auth.CURRENT_SCHOOL_ID$),
          filter((school_id) => !!school_id),
          tap(() => patchState(store, { loading: true })),
          switchMap((school_id) => {
            return from(
              supabase.client
                .from(Table.Degrees)
                .select('id,name, level:levels(*), level_id, created_at', {
                  count: 'exact',
                })
                .order('name', { ascending: true })
                .range(start(), end())
                .eq('school_id', school_id),
            ).pipe(
              map(({ data, error, count }) => {
                if (error) throw new Error(error.message);
                return { degrees: data as unknown as Degree[], count };
              }),
              tap(({ count }) => !!count && patchState(store, { count })),
              tapResponse(
                ({ degrees }) => patchState(store, { degrees }),
                (error) => console.error(error),
                () => patchState(store, { loading: false }),
              ),
            );
          }),
        ),
      ),
      async saveDegree(request: Partial<Degree>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Degrees)
          .upsert([{ ...request, school_id: auth.CURRENT_SCHOOL_ID() }]);
        if (error) {
          console.error(error);
          return;
        }
        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchDegrees(start());
      },
      async deleteDegree(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Degrees)
          .delete()
          .eq('id', id);
        if (error) {
          alert.showAlert({ icon: 'error', message: 'ALERT.FAILURE' });
          console.error(error);
          return;
        }

        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchDegrees(start);
      },
    }),
  ),
  withHooks({
    onInit({ fetchDegrees, end }) {
      fetchDegrees(end);
    },
  }),
);
