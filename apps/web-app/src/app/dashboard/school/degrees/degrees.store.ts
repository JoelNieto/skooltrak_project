import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
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
import { TranslateService } from '@ngx-translate/core';
import { Degree, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
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
  withComputed(({ start, pageSize }, auth = inject(webStore.AuthStore)) => ({
    end: computed(() => start() + (pageSize() - 1)),
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    (
      { start, end, schoolId, ...store },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => ({
      fetchDegrees: rxMethod<number>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            return from(
              supabase.client
                .from(Table.Degrees)
                .select('id,name, level:levels(*), level_id, created_at', {
                  count: 'exact',
                })
                .order('name', { ascending: true })
                .range(start(), end())
                .eq('school_id', schoolId()),
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
          .upsert([{ ...request, school_id: schoolId() }]);
        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        this.fetchDegrees(start());
      },
      async deleteDegree(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Degrees)
          .delete()
          .eq('id', id);
        if (error) {
          toast.error(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
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
