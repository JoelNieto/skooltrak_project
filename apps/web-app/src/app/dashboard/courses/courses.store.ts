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
import { Course, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { PostgrestError } from '@supabase/supabase-js';
import { filter, pipe, switchMap, tap } from 'rxjs';

type State = {
  courses: Course[];
  selectedId: string | undefined;
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
};

const initialState: State = {
  courses: [],
  selectedId: undefined,
  count: 0,
  pageSize: 5,
  start: 0,
  loading: false,
  sortColumn: '',
  sortDirection: '',
};

export const CoursesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, courses, sortColumn, sortDirection, selectedId },
      auth = inject(webStore.AuthStore),
    ) => ({
      schoolId: computed(() => auth.schoolId()),
      end: computed(() => start() + (pageSize() - 1)),
      selected: computed(() => courses().find((x) => x.id === selectedId())),
      query: computed(() => ({
        start: start(),
        pageSize: pageSize(),
        schoolId: auth.schoolId(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
      })),
      isAdmin: computed(() => auth.isAdmin()),
      isStudent: computed(() => auth.isStudent()),
      isTeacher: computed(() => auth.isTeacher()),
      userId: computed(() => auth.userId()),
    }),
  ),
  withMethods(
    (
      {
        schoolId,
        query,
        start,
        end,
        isTeacher,
        isStudent,
        userId,
        sortColumn,
        sortDirection,
        ...state
      },
      supabase = inject(SupabaseService),
    ) => {
      const updateQuery = rxMethod<typeof query>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() => fetchCourses()),
        ),
      );
      async function fetchCourses(): Promise<void> {
        patchState(state, { loading: true });
        if (isTeacher()) {
          fetchTeacherCourses();

          return;
        }

        if (isStudent()) {
          fetchStudentCourses();

          return;
        }

        let query = supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
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
          logError(error);

          return;
        }

        setCourses(data, count);
      }
      async function fetchStudentCourses(): Promise<void> {
        let query = supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, student:users!course_students!inner(id), teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
            { count: 'exact' },
          )
          .eq('school_id', schoolId())
          .range(start(), end())
          .filter('student.id', 'eq', userId());

        if (sortColumn()) {
          query = query.order(sortColumn(), {
            ascending: sortDirection() !== 'desc',
          });
        }

        const { data, error, count } = await query;
        if (error) {
          logError(error);

          return;
        }

        setCourses(data, count);
      }
      async function fetchTeacherCourses(): Promise<void> {
        const { data, error, count } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers!inner(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
            { count: 'exact' },
          )
          .eq('school_id', schoolId())
          .range(start(), end())
          .filter('teachers.id', 'eq', userId());
        if (error) {
          logError(error);

          return;
        }
        setCourses(data, count);
      }
      function logError(error: PostgrestError): void {
        console.error(error);
        patchState(state, { loading: false });
      }
      function setCourses(data: unknown, count: number | null): void {
        patchState(state, {
          courses: data as Course[],
          count: count ?? 0,
          loading: false,
        });
      }

      return {
        fetchCourses,
        fetchStudentCourses,
        fetchTeacherCourses,
        logError,
        setCourses,
        updateQuery,
      };
    },
  ),
  withHooks({
    onInit({ updateQuery, query }) {
      updateQuery(query);
    },
  }),
);
