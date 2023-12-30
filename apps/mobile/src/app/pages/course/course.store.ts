import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Course, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  courseId: string | undefined;
  details: Partial<Course> | undefined;
};

export const CourseStore = signalStore(
  withState({
    loading: false,
    courseId: undefined,
    details: undefined,
  } as State),
  withMethods(({ courseId, ...state }, supabase = inject(SupabaseService)) => ({
    fetchCourse: rxMethod<string | undefined>(
      pipe(
        filter(() => !!courseId()),
        tap(() => patchState(state, { loading: true })),
        switchMap(() =>
          from(
            supabase.client
              .from(Table.Courses)
              .select(
                'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
              )
              .eq('id', courseId())
              .single(),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as unknown as Partial<Course>;
            }),
            tapResponse({
              next: (details) => patchState(state, { details }),
              error: console.error,
              finalize: () => patchState(state, { loading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ fetchCourse, courseId }) {
      fetchCourse(courseId);
    },
  }),
);
