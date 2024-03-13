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
import { ClassGroup, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  groups: ClassGroup[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initialState: State = {
  groups: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
};

export const SchoolGroupsStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, sortColumn, sortDirection },
      auth = inject(webStore.AuthStore),
    ) => ({
      end: computed(() => start() + (pageSize() - 1)),
      schoolId: computed(() => auth.schoolId()),
      query: computed(() => ({
        pageSize: pageSize(),
        start: start(),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      })),
    }),
  ),
  withMethods(
    (
      { start, end, schoolId, query, sortColumn, sortDirection, ...state },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      const fetchGroups = rxMethod<typeof query>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getGroups()),
        ),
      );

      async function getGroups(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(id, year, name), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
            {
              count: 'exact',
            },
          )
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

        !!count && patchState(state, { count });
        patchState(state, {
          groups: data as unknown as ClassGroup[],
          loading: false,
        });
      }
      async function saveGroup(request: Partial<ClassGroup>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Groups)
          .upsert([{ ...request, school_id: schoolId() }]);

        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.success(translate.instant('ALERT.SUCCESS'));
        fetchGroups(query);
      }
      async function deleteGroup(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Groups)
          .delete()
          .eq('id', id);

        if (error) {
          toast.error(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        fetchGroups(query);
      }

      return { fetchGroups, deleteGroup, saveGroup, getGroups };
    },
  ),
  withHooks({
    onInit({ fetchGroups, query }) {
      fetchGroups(query);
    },
  }),
);
