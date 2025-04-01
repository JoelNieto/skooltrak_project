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
import { SupabaseService, mobileStore } from '@skooltrak/store';
import { PostgrestError } from '@supabase/supabase-js';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  courses: Course[];
  selectedId: string | undefined;
  error: boolean;
};

export const CoursesStore = signalStore(
  { protectedState: false }, withState({
    loading: false,
    courses: [],
    selectedId: undefined,
    error: false,
  } as State),
  withComputed(
    ({ courses, selectedId }, auth = inject(mobileStore.AuthStore)) => ({
      selected: computed(() => courses().find((x) => x.id === selectedId())),
      userId: computed(() => auth.userId()),
      isAdmin: computed(() => auth.isAdmin()),
      isStudent: computed(() => auth.isStudent()),
      isTeacher: computed(() => auth.isTeacher()),
      schoolId: computed(() => auth.schoolId()),
    }),
  ),
  withMethods(
    (
      { userId, isStudent, isTeacher, schoolId, ...state },
      supabase = inject(SupabaseService),
    ) => {
      const requestCourses = rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => fetchCourses()),
        ),
      );

      async function fetchCourses(): Promise<void> {
        patchState(state, { loading: true, error: false, courses: [] });

        if (isStudent()) {
          await fetchStudentCourses();

          return;
        }
        if (isTeacher()) {
          await fetchTeacherCourses();

          return;
        }
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .order('subject(name)', { ascending: true })
          .eq('school_id', schoolId());

        if (error) {
          logError(error);

          return;
        }

        setCourses(data);
      }
      async function fetchStudentCourses(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, student:users!course_students!inner(id), teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .eq('school_id', schoolId())
          .order('subject(name)')
          .filter('student.id', 'eq', userId());
        if (error) {
          logError(error);

          return;
        }
        setCourses(data);
      }

      async function fetchTeacherCourses(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers!inner(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .eq('school_id', schoolId())
          .order('subject(name)', { ascending: true })
          .filter('teachers.id', 'eq', userId());
        if (error) {
          logError(error);

          return;
        }
        setCourses(data);
      }

      function logError(error: PostgrestError): void {
        console.error(error);
        patchState(state, { loading: false, error: true });
      }

      function setCourses(data: unknown): void {
        patchState(state, { courses: data as Course[], loading: false });
      }

      return {
        fetchCourses,
        fetchStudentCourses,
        fetchTeacherCourses,
        logError,
        setCourses,
        requestCourses,
      };
    },
  ),
  withHooks({
    onInit({ requestCourses, schoolId }) {
      requestCourses(schoolId);
    },
  }),
);
