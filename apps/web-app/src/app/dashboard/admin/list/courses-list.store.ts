import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Course, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  courses: Course[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
};

const initialState: State = {
  courses: [],
  count: 0,
  pageSize: 5,
  start: 0,
  loading: false,
};

export const CoursesListStore = signalStore(
  withState(initialState),
  withComputed(({ start, pageSize }, auth = inject(webStore.AuthStore)) => ({
    schoolId: computed(() => auth.schoolId()),
    end: computed(() => start() + (pageSize() - 1)),
    query: computed(() => ({
      start: start(),
      pageSize: pageSize(),
      schoolId: auth.schoolId(),
    })),
  })),
  withMethods(
    (
      { schoolId, query, start, end, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      fetchCourses: rxMethod<typeof query>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Courses)
                .select(
                  'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
                  { count: 'exact' },
                )
                .eq('school_id', schoolId())
                .range(start(), end()),
            ).pipe(
              map(({ error, data, count }) => {
                if (error) throw new Error(error.message);
                patchState(state, { count: count ?? 0 });

                return data as unknown as Course[];
              }),
              tapResponse({
                next: (courses) => patchState(state, { courses }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ fetchCourses, query }) {
      fetchCourses(query);
    },
  }),
);
