import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Course, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

type State = {
  loading: boolean;
  courses: Course[];
};

export const HomeStore = signalStore(
  withState({ loading: false, courses: [] } as State),
  withMethods(({ ...state }, supabase = inject(SupabaseService)) => ({
    async fetchCourses(): Promise<void> {
      patchState(state, { loading: true });
      const { data, error } = await supabase.client
        .from(Table.Courses)
        .select(
          'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
          { count: 'exact' },
        );

      if (error) {
        console.error(error);
        patchState(state, { loading: false });
        return;
      }

      patchState(state, {
        courses: data as unknown as Course[],
        loading: false,
      });
    },
  })),
  withHooks({
    onInit({ fetchCourses }) {
      fetchCourses();
    },
  }),
);