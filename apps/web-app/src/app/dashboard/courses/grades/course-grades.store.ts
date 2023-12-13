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
import { GradeObject, Period, Table } from '@skooltrak/models';
import { authState, SupabaseService } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

import { CoursesStore } from '../courses.store';

type State = {
  periods: Period[];
  periodId: string | undefined;
  loading: boolean;
  grades: Partial<GradeObject>[];
};

const initialState: State = {
  periods: [],
  periodId: undefined,
  loading: false,
  grades: [],
};

export const CourseGradesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { periodId },
      auth = inject(authState.AuthStateFacade),
      courses = inject(CoursesStore),
    ) => ({
      courseId: computed(() => courses.selectedId()),
      course: computed(() => courses.selected()),
      query: computed(() => ({
        periodId: periodId(),
        courseId: courses.selectedId(),
      })),
      schoolId: computed(() => auth.CURRENT_SCHOOL_ID()),
    }),
  ),
  withMethods(
    (
      { schoolId, query, periodId, courseId, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      async fetchPeriods(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Periods)
          .select('id, name, year, start_at, end_at, school_id')
          .eq('school_id', schoolId());

        if (error) {
          console.error(error);
          return;
        }

        patchState(state, { periods: data });
      },
      fetchGrades: rxMethod<typeof query>(
        pipe(
          filter(() => !!periodId() && !!courseId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Grades)
                .select(
                  'id, title, period:periods(id, name), bucket:grade_buckets(*), start_at, items:grade_items(*)',
                )
                .eq('course_id', courseId())
                .eq('period_id', periodId()),
            ).pipe(
              map(({ data, error }) => {
                if (error) throw new Error(error.message);
                return data as Partial<GradeObject>[];
              }),
              tapResponse({
                next: (grades) => patchState(state, { grades }),
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
    onInit({ fetchGrades, fetchPeriods, query }) {
      fetchPeriods();
      fetchGrades(query);
    },
  }),
);
