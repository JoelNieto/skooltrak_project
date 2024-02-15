import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Course, Degree, StudyPlan, Table, User } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { pick } from 'lodash';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  courses: Partial<Course>[];
  plans: Partial<StudyPlan>[];
  degrees: Partial<Degree>[];
  planId: string | undefined;
  count: number;
  pageSize: number;
  start: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
};

const initialState: State = {
  loading: false,
  courses: [],
  plans: [],
  degrees: [],
  planId: undefined,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
};

export const SchoolCoursesStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, planId, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => ({
      end: computed(() => start() + (pageSize() - 1)),
      school_id: computed(() => auth.schoolId()),
      query: computed(() => ({
        school_id: auth.schoolId(),
        start: start(),
        pageSize: pageSize(),
        planId: planId(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
      })),
    }),
  ),
  withMethods(
    (
      {
        school_id,
        query,
        planId,
        end,
        start,
        sortColumn,
        sortDirection,
        ...state
      },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      const fetchDegrees = rxMethod<string | undefined>(
        pipe(
          filter(() => !!school_id()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Degrees)
                .select(
                  'id, name, level:levels(id, name, sort), plans:school_plans(id, name, year)',
                )
                .order('level(sort)', { ascending: true })
                .eq('school_id', school_id()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as unknown as Partial<Degree>[];
              }),
              tapResponse({
                next: (degrees) => patchState(state, { degrees }),
                error: console.error,
              }),
            ),
          ),
        ),
      );

      async function getCourses(): Promise<void> {
        patchState(state, { loading: true });
        let request = supabase.client
          .from(Table.Courses)
          .select(
            'id, school_id, subject:school_subjects(id, name), picture_url, subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
            {
              count: 'exact',
            },
          )
          .eq('school_id', school_id())
          .range(start(), end());

        request = planId() ? request.eq('plan_id', planId()) : request;

        if (sortColumn()) {
          request = request.order(sortColumn(), {
            ascending: sortDirection() !== 'desc',
          });
        }
        const { data, error, count } = await request;
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          count: count ?? 0,
          courses: data as unknown as Partial<Course>[],
          loading: false,
        });
      }

      const fetchCourses = rxMethod<typeof query>(
        pipe(
          filter(() => !!school_id()),
          tap(() => getCourses()),
        ),
      );

      async function saveCourse(request: Partial<Course>): Promise<void> {
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
          toast.error(translate.instant('ALERT.FAILURE'));

          patchState(state, { loading: false });
          console.error(error);

          return;
        }

        const { teachers, id } = request;
        !!teachers?.length && !!id && (await saveCourseTeachers(id, teachers));
        toast.success(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false });
        fetchCourses(query);
      }

      async function saveCourseTeachers(
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
      }

      return {
        fetchCourses,
        fetchDegrees,
        saveCourse,
        saveCourseTeachers,
        getCourses,
      };
    },
  ),
  withHooks({
    onInit({ fetchDegrees, fetchCourses, school_id, query }) {
      fetchDegrees(school_id);
      fetchCourses(query);
    },
  }),
);
