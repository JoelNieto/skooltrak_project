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
import { Course, Degree, StudyPlan, Table, User } from '@skooltrak/models';
import { authState, SupabaseService } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';
import { orderBy, pick } from 'lodash';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  courses: Partial<Course>[];
  plans: Partial<StudyPlan>[];
  degrees: Partial<Degree>[];
  degreeId: string | undefined;
  planId: string | undefined;
  count: number;
  pageSize: number;
  start: number;
};

const initialState: State = {
  loading: false,
  courses: [],
  plans: [],
  degrees: [],
  degreeId: undefined,
  planId: undefined,
  count: 0,
  pageSize: 5,
  start: 0,
};

export const SchoolCoursesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, degreeId, planId },
      auth = inject(authState.AuthStateFacade),
    ) => ({
      end: computed(() => start() + (pageSize() - 1)),
      school_id: computed(() => auth.CURRENT_SCHOOL_ID()),
      query: computed(() => ({
        school_id: auth.CURRENT_SCHOOL_ID(),
        start: start(),
        pageSize: pageSize(),
        degreeId: degreeId(),
        planId: planId(),
      })),
    }),
  ),
  withMethods(
    (
      { school_id, query, planId, degreeId, end, start, ...state },
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      fetchDegrees: rxMethod<string | undefined>(
        pipe(
          filter(() => !!school_id()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Degrees)
                .select('id, name, level:levels(id, name, sort)')
                .eq('school_id', school_id()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);
                return orderBy(data, [
                  'level.sort',
                ]) as unknown as Partial<Degree>[];
              }),
              tapResponse({
                next: (degrees) => patchState(state, { degrees }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
      fetchPlans: rxMethod<string | undefined>(
        pipe(
          filter(() => !!degreeId()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.StudyPlans)
                .select('id, name')
                .eq('school_id', school_id())
                .eq('degree_id', degreeId()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);
                return data as Partial<StudyPlan>[];
              }),
              tapResponse({
                next: (plans) => patchState(state, { plans }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
      fetchCourses: rxMethod<typeof query>(
        pipe(
          filter(() => !!school_id()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() => {
            let request = supabase.client
              .from(Table.Courses)
              .select(
                'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
                {
                  count: 'exact',
                },
              )
              .eq('school_id', school_id())
              .range(start(), end());

            request = planId() ? request.eq('plan_id', planId()) : request;

            return from(request).pipe(
              map(({ error, data, count }) => {
                if (error) throw new Error(error.message);
                return {
                  courses: data as unknown as Partial<Course>[],
                  count: count ?? 0,
                };
              }),
              tapResponse({
                next: ({ courses, count }) =>
                  patchState(state, { count, courses }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            );
          }),
        ),
      ),
      async saveCourse(request: Partial<Course>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client.from(Table.Courses).upsert([
          {
            ...pick(request, [
              'id',
              'description',
              'weekly_hours',
              'plan_id',
              'subject_id',
            ]),
            school_id: school_id(),
          },
        ]);
        if (error) {
          alert.showAlert({
            icon: 'error',
            message: 'ALERT.FAILURE',
          });

          patchState(state, { loading: false });
          console.error(error);
          return;
        }

        const { teachers, id } = request;
        !!teachers?.length &&
          !!id &&
          (await this.saveCourseTeachers(id, teachers));

        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        patchState(state, { loading: false });
        this.fetchCourses(query);
      },
      async saveCourseTeachers(
        course_id: string,
        teachers: Partial<User>[],
      ): Promise<void> {
        const items = teachers.map((x) => ({
          user_id: x.id,
          course_id: course_id,
        }));
        const { error } = await supabase.client
          .from(Table.CourseTeachers)
          .upsert(items);
        if (error) console.error(error);
      },
    }),
  ),
  withHooks({
    onInit({
      fetchDegrees,
      fetchCourses,
      fetchPlans,
      school_id,
      degreeId,
      query,
    }) {
      fetchDegrees(school_id);
      fetchPlans(degreeId);
      fetchCourses(query);
    },
  }),
);
