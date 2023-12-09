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
import { Subject, Table } from '@skooltrak/models';
import { authState, SupabaseService } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  subjects: Subject[];
  count: number;
  pageSize: number;
  start: number;
  queryText: string;
  loading: boolean;
};

const initialState: State = {
  subjects: [],
  loading: true,
  count: 0,
  pageSize: 5,
  queryText: '',
  start: 0,
};
export const SchoolSubjectsStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, queryText },
      auth = inject(authState.AuthStateFacade),
    ) => ({
      end: computed(() => start() + (pageSize() - 1)),
      query: computed(() => ({
        start: start(),
        text: queryText(),
        pageSize: pageSize(),
        school_id: auth.CURRENT_SCHOOL_ID(),
      })),
    }),
  ),
  withMethods(
    (
      { query, end, ...store },
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      fetchSubjects: rxMethod<typeof query>(
        pipe(
          filter(() => !!query().school_id),
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Subjects)
                .select(
                  'id,name, short_name, code, description, created_at, user:users(full_name)',
                  {
                    count: 'exact',
                  },
                )
                .order('name', { ascending: true })
                .range(query().start, end())
                .eq('school_id', query().school_id)
                .or(
                  `name.ilike.%${query().text}%, short_name.ilike.%${
                    query().text
                  }%, code.ilike.%${query().text}%, description.ilike.%${
                    query().text
                  }%`,
                ),
            ).pipe(
              map(({ error, data, count }) => {
                if (error) throw new Error(error.message);
                return {
                  subjects: data as unknown as Subject[],
                  count: count ?? 0,
                };
              }),
              tapResponse({
                next: ({ subjects, count }) =>
                  patchState(store, { subjects, count }),
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      async saveSubject(request: Partial<Subject>): Promise<void> {
        patchState(store, { loading: true });
        const { error } = await supabase.client
          .from(Table.Subjects)
          .upsert([{ ...request, school_id: query().school_id }]);
        if (error) {
          alert.showAlert({
            icon: 'error',
            message: 'ALERT.FAILURE',
          });
          console.error(error);
          patchState(store, { loading: false });
          return;
        }
        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchSubjects(query);
      },
      async deleteSubject(id: string): Promise<void> {
        patchState(store, { loading: true });
        const { error } = await supabase.client
          .from(Table.Subjects)
          .delete()
          .eq('id', id);
        if (error) {
          alert.showAlert({
            icon: 'error',
            message: 'ALERT.FAILURE',
          });
          console.error(error);
          patchState(store, { loading: false });
          return;
        }
        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchSubjects(query);
      },
    }),
  ),
  withHooks({
    onInit({ query, fetchSubjects }) {
      fetchSubjects(query);
    },
  }),
);
