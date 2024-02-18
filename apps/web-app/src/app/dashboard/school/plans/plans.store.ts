import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { StudyPlan, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { debounceTime, filter, pipe, tap } from 'rxjs';

type State = {
  plans: StudyPlan[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initialState: State = {
  plans: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
};

export const SchoolPlansStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const fetchData = computed(() => ({
        pageSize: pageSize(),
        end: end(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
        schoolId: auth.schoolId(),
      }));

      return { end, fetchData };
    },
  ),
  withMethods(
    (
      { start, end, fetchData, ...state },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      async function getPlans(): Promise<void> {
        patchState(state, { loading: true });

        let query = supabase.client
          .from(Table.StudyPlans)
          .select(
            'id,name, level:levels(*), level_id, degree_id, degree:school_degrees(*), year, created_at',
            {
              count: 'exact',
            },
          )
          .range(start(), end())
          .eq('school_id', fetchData().schoolId);

        if (fetchData().sortColumn) {
          query = query.order(fetchData().sortColumn, {
            ascending: fetchData().sortDirection !== 'desc',
          });
        }

        const { data, error, count } = await query;

        if (error) {
          console.error(error);

          patchState(state, { loading: false });
        }

        patchState(state, {
          count: count ?? 0,
          plans: data as unknown as StudyPlan[],
          loading: false,
        });
      }

      const fetchPlans = rxMethod<typeof fetchData>(
        pipe(
          debounceTime(250),
          filter(() => !!fetchData().schoolId),
          tap(() => getPlans()),
        ),
      );
      async function savePlan(request: Partial<StudyPlan>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .upsert([{ ...request, school_id: fetchData().schoolId }]);
        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.success(translate.instant('ALERT.SUCCESS'));
        fetchPlans(fetchData);
      }
      async function deletePlan(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .delete()
          .eq('id', id);
        if (error) {
          toast.error(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        fetchPlans(fetchData);
      }

      return { deletePlan, savePlan, fetchPlans };
    },
  ),
  withHooks({
    onInit({ fetchPlans, fetchData }) {
      fetchPlans(fetchData);
    },
  }),
);
