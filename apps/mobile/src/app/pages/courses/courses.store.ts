import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Course, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';
import { PostgrestError } from '@supabase/supabase-js';

type State = {
  loading: boolean;
  courses: Course[];
  selectedId: string | undefined;
  error: boolean;
};

export const CoursesStore = signalStore(
  withState({
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
    ) => ({
      async fetchCourses(): Promise<void> {
        patchState(state, { loading: true, error: false });

        if (isStudent()) {
          await this.fetchStudentCourses();
          return;
        }
        if (isTeacher()) {
          await this.fetchTeacherCourses();
          return;
        }
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .eq('school_id', schoolId());

        if (error) {
          this.logError(error);
          return;
        }

        this.setCourses(data);
      },
      async fetchStudentCourses(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, student:users!course_students!inner(id), teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .eq('school_id', schoolId())
          .filter('student.id', 'eq', userId());
        if (error) {
          this.logError(error);
          return;
        }
        this.setCourses(data);
      },
      async fetchTeacherCourses(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers!inner(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description',
          )
          .eq('school_id', schoolId())
          .filter('teachers.id', 'eq', userId());
        if (error) {
          this.logError(error);
          return;
        }
        this.setCourses(data);
      },
      logError(error: PostgrestError): void {
        console.error(error);
        patchState(state, { loading: false, error: true });
      },
      setCourses(data: unknown): void {
        patchState(state, {
          courses: data as Course[],
          loading: false,
        });
      },
    }),
  ),
);
