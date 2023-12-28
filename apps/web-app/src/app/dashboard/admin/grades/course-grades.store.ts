import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { GradeObject, Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

import { CourseDetailsStore } from '../courses/details/course-details.store';

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
      auth = inject(webStore.AuthStore),
      course = inject(CourseDetailsStore),
    ) => ({
      courseId: computed(() => course.courseId()),
      course: computed(() => course.course()),
      query: computed(() => ({
        periodId: periodId(),
        courseId: course.courseId(),
      })),
      students: computed(() => course.students()),
      schoolId: computed(() => auth.schoolId()),
    }),
  ),
  withMethods(
    (
      { schoolId, query, periodId, courseId, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      fetchPeriods: rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Periods)
                .select('id, name, year, start_at, end_at, school_id')
                .eq('school_id', schoolId()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as Period[];
              }),
              tapResponse({
                next: (periods) => patchState(state, { periods }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
      fetchGrades: rxMethod<typeof query>(
        pipe(
          filter(() => !!periodId() && !!courseId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Grades)
                .select(
                  'id, title, period:periods(id, name), bucket:grade_buckets(*), bucket_id, start_at, items:grade_items(*)',
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
      refresh(): void {
        this.fetchGrades(query);
      },
    }),
  ),
  withHooks({
    onInit({ fetchGrades, fetchPeriods, query, schoolId }) {
      fetchPeriods(schoolId);
      fetchGrades(query);
    },
  }),
);
