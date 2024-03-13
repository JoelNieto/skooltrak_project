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
import { GradeBucket, GradeItem, Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap } from 'rxjs';

import { CourseDetailsStore } from '../courses/details/course-details.store';

type State = {
  loading: boolean;
  grades: GradeItem[];
  periods: Period[];
  types: GradeBucket[];
  periodId: string | undefined;
  error: boolean;
};

const initialState: State = {
  loading: false,
  grades: [],
  periods: [],
  types: [],
  periodId: undefined,
  error: false,
};

export const StudentGradesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { periodId },
      auth = inject(webStore.AuthStore),
      course = inject(CourseDetailsStore),
    ) => ({
      courseId: computed(() => course.courseId()),
      schoolId: computed(() => auth.schoolId()),
      userId: computed(() => auth.userId()),
      query: computed(() => ({
        userId: auth.userId(),
        courseId: course.courseId(),
        periodId: periodId(),
      })),
    }),
  ),
  withMethods(
    (
      { courseId, userId, schoolId, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function getGrades(): Promise<void> {
        patchState(state, { loading: true, error: false });

        const { data, error } = await supabase.client
          .from(Table.GradeItems)
          .select(
            'id, grade:grades(id, title, period_id, bucket:grade_buckets(id, name), course_id), score, comments, created_at',
          )
          .eq('grade.course_id', courseId())
          .eq('student_id', userId());

        if (error) {
          console.error(error);
          patchState(state, { loading: false, error: true });

          return;
        }

        patchState(state, {
          loading: false,
          grades: data as unknown as GradeItem[],
        });
      }

      const fetchPeriods = rxMethod<string | undefined>(
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
      );

      return { getGrades, fetchPeriods };
    },
  ),
  withHooks({
    onInit({ getGrades, fetchPeriods, schoolId }) {
      getGrades();
      fetchPeriods(schoolId);
    },
  }),
);
