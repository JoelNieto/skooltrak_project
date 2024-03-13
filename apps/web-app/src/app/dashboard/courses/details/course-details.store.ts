import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ClassGroup, Course, StudentProfile, Table, User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  course: Partial<Course> | undefined;
  teachers: Partial<User>[];
  students: StudentProfile[];
  groups: Partial<ClassGroup>[];
  loading: boolean;
};
const initialState: State = {
  course: undefined,
  teachers: [],
  students: [],
  groups: [],
  loading: false,
};

export const CourseDetailsStore = signalStore(
  withState(initialState),
  withComputed(({ course }) => ({
    courseId: computed(() => course()?.id),
    planId: computed(() => course()?.plan_id),
  })),
  withMethods(
    (
      { course, courseId, planId, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function fetchCourse(id: string): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), subject_id, period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
          )
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          loading: false,
          course: data as unknown as Partial<Course>,
        });
      }

      const fetchInfo = rxMethod<Partial<Course> | undefined>(
        pipe(
          filter(() => !!course()),
          tap(() => fetchTeachers()),
          tap(() => fetchGroups()),
          tap(() => fetchStudents()),
        ),
      );

      async function fetchTeachers(): Promise<void> {
        const { data: teachers, error } = await supabase.client
          .from(Table.Users)
          .select(
            'first_name, father_name, email, avatar_url, courses:courses!course_teachers!inner(id)',
          )
          .filter('courses.id', 'eq', courseId());

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { teachers });
      }

      async function fetchGroups(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(*), degree:school_degrees(*), created_at, updated_at',
          )
          .eq('plan_id', planId());

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { groups: data as Partial<ClassGroup>[] });
      }

      async function fetchStudents(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Users)
          .select(
            'id, first_name, middle_name, father_name, mother_name, document_id, email, birth_date, avatar_url, courses!course_students!inner(id), profile:school_users(school:schools(id, short_name, full_name), group:school_groups(id,name)))',
          )
          .filter('courses.id', 'eq', courseId());

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { students: data as unknown as StudentProfile[] });
      }

      return {
        fetchCourse,
        fetchInfo,
      };
    },
  ),
  withHooks({
    onInit({ fetchInfo, course }) {
      fetchInfo(course);
    },
  }),
);
