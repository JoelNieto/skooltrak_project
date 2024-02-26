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
import { QuizAssignation, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  assignations: QuizAssignation[];
  count: number;
  pageSize: number;
  start: number;

  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initial: State = {
  loading: false,
  assignations: [],
  count: 0,
  pageSize: 5,
  start: 0,
  sortDirection: 'desc',
  sortColumn: 'created_at',
};

export const QuizAssignationsStore = signalStore(
  withState(initial),
  withComputed(
    (
      { start, pageSize, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const schoolId = computed(() => auth.schoolId());
      const fetchData = computed(() => ({
        start: start(),
        pageSize: pageSize(),
        schoolId: schoolId(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
      }));

      return { end, fetchData, schoolId };
    },
  ),
  withMethods(
    (
      { schoolId, end, start, sortColumn, sortDirection, fetchData, ...state },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      const fetchAssignations = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getAssignations()),
        ),
      );

      async function getAssignations(): Promise<void> {
        patchState(state, { loading: false });
        let query = supabase.client
          .from(Table.QuizAssignations)
          .select(
            'id, quiz_id, quiz:quizzes(*), course_id, course:courses(id, subject:school_subjects(id, name), plan:school_plans(id, name)), minutes, school_id, hidden, start_date, end_date, created_at, user:users(id, first_name, father_name, email)',
            { count: 'exact' },
          )
          .eq('school_id', schoolId())
          .range(start(), end());

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
          loading: false,
          assignations: data as unknown as QuizAssignation[],
          count: count ?? 0,
        });
      }

      async function deleteAssignation(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.QuizAssignations)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.info(translate.instant('ALERT.SUCCESS'));
      }

      return { fetchAssignations, deleteAssignation, getAssignations };
    },
  ),
  withHooks({
    onInit({ fetchAssignations, fetchData }) {
      fetchAssignations(fetchData);
    },
  }),
);
