import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Quiz, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  quizzes: Partial<Quiz>[];
  count: number;
  pageSize: number;
  start: number;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: '';
};

const initial: State = {
  loading: false,
  quizzes: [],
  count: 0,
  pageSize: 5,
  start: 0,
  sortDirection: '',
  sortColumn: '',
};

export const QuizzesStore = signalStore(
  withState(initial),
  withComputed(
    (
      { start, pageSize, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => {
      const schoolId = computed(() => auth.schoolId());
      const end = computed(() => start() + (pageSize() - 1));
      const fetchData = computed(() => ({
        start: start(),
        pageSize: pageSize(),
        schoolId: auth.schoolId(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
      }));

      return { schoolId, end, fetchData };
    },
  ),
  withMethods(
    (
      { fetchData, schoolId, start, end, sortColumn, sortDirection, ...state },
      supabase = inject(SupabaseService),
    ) => {
      const fetchQuizzes = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getQuizzes()),
        ),
      );

      async function getQuizzes(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.Quizzes)
          .select(
            'id, title, description, user:users(email, first_name, father_name), created_at',
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

        patchState(state, { loading: false, quizzes: data, count: count ?? 0 });
      }

      return { fetchQuizzes };
    },
  ),

  withHooks({
    onInit({ fetchQuizzes, fetchData }) {
      fetchQuizzes(fetchData);
    },
  }),
);
