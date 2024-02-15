import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
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
import { filter, pipe, tap } from 'rxjs';

type State = {
  degrees: Degree[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
};

const initialState: State = {
  degrees: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
};

export const SchoolDegreesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, sortColumn, sortDirection },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const schoolId = computed(() => auth.schoolId());
      const fetchData = computed(() => ({
        end: end(),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
        schoolId: schoolId(),
      }));

      return { end, schoolId, fetchData };
    },
  ),
  withMethods(
    (
      { start, end, schoolId, sortColumn, sortDirection, fetchData, ...state },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      async function getDegrees(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.Degrees)
          .select('id,name, level:levels(*), level_id, created_at', {
            count: 'exact',
          })
          .range(start(), end())
          .eq('school_id', schoolId());

        if (sortColumn()) {
          query = query.order(sortColumn(), {
            ascending: sortDirection() !== 'desc',
          });
        }

        const { data, error, count } = await query;

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          count: count ?? 0,
          loading: false,
          degrees: data as unknown as Degree[],
        });
      }
      const fetchDegrees = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getDegrees()),
        ),
      );
      async function saveDegree(request: Partial<Degree>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Degrees)
          .upsert([{ ...request, school_id: schoolId() }]);
        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        fetchDegrees(fetchData);
      }
      async function deleteDegree(id: string): Promise<void> {
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
        fetchDegrees(fetchData);
      }

      return { deleteDegree, saveDegree, fetchDegrees };
    },
  ),
  withHooks({
    onInit({ fetchDegrees, fetchData }) {
      fetchDegrees(fetchData);
    },
  }),
);
