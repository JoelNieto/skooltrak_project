import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { GradeItem, Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { groupBy } from 'lodash';
import { filter, pipe, tap } from 'rxjs';

import { CoursesStore } from './courses.store';

type State = {
  loading: boolean;
  periods: Period[];
  grades: Partial<GradeItem>[];
  currentPeriod: string | undefined;
};

const initial: State = {
  loading: false,
  periods: [],
  grades: [],
  currentPeriod: undefined,
};

export const CourseGradesStore = signalStore(
  { protectedState: false }, withState(initial),
  withComputed(
    (
      { currentPeriod, grades },
      auth = inject(webStore.AuthStore),
      courses = inject(CoursesStore),
    ) => {
      const schoolId = computed(() => auth.schoolId());
      const userId = computed(() => auth.userId());
      const course = computed(() => courses.selected());
      const courseId = computed(() => courses.selectedId());
      const query = computed(() => ({
        schoolId: schoolId(),
        courseId: courseId(),
        periodId: currentPeriod(),
        userId: userId(),
      }));

      const groupedGrades = computed(() =>
        groupBy(grades(), 'grade.bucket.name'),
      );

      return { schoolId, course, courseId, query, userId, groupedGrades };
    },
  ),
  withMethods(
    (
      { schoolId, courseId, currentPeriod, userId, query, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function fetchPeriods(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Periods)
          .select('id, name, year, start_at, end_at, school_id')
          .eq('school_id', schoolId());
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        patchState(state, { periods: data, loading: false });
      }

      async function fetchGrades(): Promise<void> {
        patchState(state, { loading: true, grades: [] });

        const { data, error } = await supabase.client
          .from(Table.GradeItems)
          .select(
            'id, grade:grades!inner(id, title, period_id, bucket:grade_buckets(id, name), course_id), score, comments, created_at',
          )
          .eq('grade.course_id', courseId())
          .eq('grade.period_id', currentPeriod())
          .eq('student_id', userId());

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          grades: data as unknown as GradeItem[],
          loading: false,
        });
      }

      const getPeriods = rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId() && !!courseId()),
          tap(() => fetchPeriods()),
        ),
      );

      const getGrades = rxMethod<typeof query>(
        pipe(
          filter(() => !!courseId() && !!currentPeriod() && !!userId()),
          tap(() => fetchGrades()),
        ),
      );

      return { fetchPeriods, getPeriods, fetchGrades, getGrades };
    },
  ),
  withHooks({
    onInit({ getPeriods, schoolId, getGrades, query }) {
      getPeriods(schoolId);
      getGrades(query);
    },
  }),
);
