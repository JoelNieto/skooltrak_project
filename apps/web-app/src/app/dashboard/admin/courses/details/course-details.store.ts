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
import { ClassGroup, Course, Table, User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { distinctUntilChanged, filter, from, map, pipe, switchMap } from 'rxjs';

type State = {
  course: Partial<Course> | undefined;
  teachers: Partial<User>[];
  students: Partial<User & { group_id: string; group_name: string }>[];
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
  withMethods(({ ...state }, supabase = inject(SupabaseService)) => ({
    async fetchCourse(id: string): Promise<void> {
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
    },
    fetchTeachers: rxMethod<string | undefined>(
      pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        switchMap((id) =>
          from(
            supabase.client
              .from(Table.Users)
              .select(
                'first_name, father_name, email, avatar_url, courses:courses!course_teachers!inner(id)',
              )
              .filter('courses.id', 'eq', id),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);

              return data as Partial<User>[];
            }),
            tapResponse({
              next: (teachers) => patchState(state, { teachers }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
    fetchGroups: rxMethod<string | undefined>(
      pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        switchMap((id) =>
          from(
            supabase.client
              .from(Table.Groups)
              .select(
                'id, name, plan:school_plans(*), degree:school_degrees(*), created_at, updated_at',
              )
              .eq('plan_id', id),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);

              return data as Partial<ClassGroup>[];
            }),
            tapResponse({
              next: (groups) => patchState(state, { groups }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
    fetchStudents: rxMethod<string | undefined>(
      pipe(
        filter((id) => !!id),
        switchMap((id) =>
          from(
            supabase.client
              .from(Table.Students)
              .select(
                'id, first_name, middle_name, father_name, mother_name, avatar_url, group_id, group_name',
              )
              .eq('plan_id', id),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);

              return data;
            }),
            tapResponse({
              next: (students) => patchState(state, { students }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ fetchTeachers, fetchGroups, courseId, planId, fetchStudents }) {
      fetchTeachers(courseId);
      fetchGroups(planId);
      fetchStudents(planId);
    },
  }),
);
