import { computed, inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/store';
import { Course, Degree, StudyPlan, Table, User } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { orderBy, pick } from 'lodash';
import {
  combineLatestWith,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

type State = {
  LOADING: boolean;
  COURSES: Partial<Course>[];
  PLANS: Partial<StudyPlan>[];
  DEGREES: Partial<Degree>[];
  SELECTED_DEGREE: string | undefined;
  SELECTED_PLAN: string | undefined;
  COUNT: number;
  PAGE_SIZE: number;
  START: number;
};

@Injectable()
export class SchoolCoursesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);

  public readonly COURSES = this.selectSignal((state) => state.COURSES);
  public readonly DEGREES = this.selectSignal((state) => state.DEGREES);
  public readonly PLANS = this.selectSignal((state) => state.PLANS);
  public readonly selectedDegree$ = this.select(
    (state) => state.SELECTED_DEGREE,
  );
  public readonly selectedPlan$ = this.select((state) => state.SELECTED_PLAN);
  public readonly selectedPlan = this.selectSignal(
    (state) => state.SELECTED_PLAN,
  );
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly START = this.selectSignal((state) => state.START);
  private readonly END = computed(() => this.START() + (this.PAGE_SIZE() - 1));
  public readonly start$ = this.select((state) => state.START);

  private readonly fetchCoursesData$ = this.select(
    {
      start: this.start$,
      plan: this.selectedPlan$,
    },
    { debounce: true },
  );

  private readonly fetchDegrees = this.effect<void>((trigger$) =>
    trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      switchMap(([, school_id]) =>
        from(
          this.supabase.client
            .from(Table.Degrees)
            .select('id, name, level:levels(id, name, sort)')
            .eq('school_id', school_id),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return orderBy(data, [
              'level.sort',
            ]) as unknown as Partial<Degree>[];
          }),
          tapResponse(
            (DEGREES) => this.patchState({ DEGREES }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    ),
  );

  private readonly fetchCourses = this.effect(() => {
    return this.fetchCoursesData$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([{ plan }, school_id]) => !!school_id && !!plan),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([{ start, plan }, school_id]) => {
        return from(
          this.supabase.client
            .from(Table.Courses)
            .select(
              'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
              {
                count: 'exact',
              },
            )
            .eq('school_id', school_id)
            .eq('plan_id', plan)
            .range(start, this.END()),
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { courses: data, count };
          }),
          tap(({ count }) => !!count && this.patchState({ COUNT: count })),
          tapResponse(
            ({ courses }) =>
              this.patchState({ COURSES: courses as unknown as Course[] }),
            (error) => {
              console.error(error);
              return of([]);
            },
            () => this.patchState({ LOADING: false }),
          ),
        );
      }),
    );
  });

  private readonly fetchPlans = this.effect(
    (degree_id$: Observable<string | undefined>) =>
      degree_id$.pipe(
        combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
        filter(([degree_id, school_id]) => !!degree_id && !!school_id),
        switchMap(([degree_id, school_id]) =>
          from(
            this.supabase.client
              .from(Table.StudyPlans)
              .select('id, name')
              .eq('school_id', school_id)
              .eq('degree_id', degree_id),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as Partial<StudyPlan>[];
            }),
            tapResponse(
              (PLANS) => this.patchState({ PLANS }),
              (error) => {
                console.error(error);
              },
              () => this.patchState({ SELECTED_PLAN: undefined, COURSES: [] }),
            ),
          ),
        ),
      ),
  );

  public readonly saveCourse = this.effect(
    (request$: Observable<Partial<Course>>) =>
      request$.pipe(
        switchMap((request) =>
          from(
            this.supabase.client
              .from(Table.Courses)
              .upsert([
                {
                  ...pick(request, [
                    'id',
                    'description',
                    'weekly_hours',
                    'plan_id',
                    'subject_id',
                  ]),
                  school_id: this.auth.CURRENT_SCHOOL_ID(),
                },
              ])
              .select('id'),
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            }),
            tapResponse(
              () => {
                const { teachers, id } = request;
                !!teachers?.length &&
                  this.saveCourseTeachers({
                    teachers: teachers,
                    course_id: id!,
                  });
                this.alert.showAlert({
                  icon: 'success',
                  message: 'ALERT.SUCCESS',
                });
              },
              () =>
                this.alert.showAlert({
                  icon: 'error',
                  message: 'ALERT.FAILURE',
                }),
              () => this.patchState({ START: 0 }),
            ),
          ),
        ),
      ),
  );

  private readonly saveCourseTeachers = this.effect(
    (request$: Observable<{ course_id: string; teachers: Partial<User>[] }>) =>
      request$.pipe(
        map((request) =>
          request.teachers.map((x) => ({
            user_id: x.id,
            course_id: request.course_id,
          })),
        ),
        switchMap((items) =>
          from(
            this.supabase.client.from(Table.CourseTeachers).upsert(items),
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            }),
          ),
        ),
      ),
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      LOADING: false,
      PLANS: [],
      COURSES: [],
      DEGREES: [],
      SELECTED_DEGREE: undefined,
      SELECTED_PLAN: undefined,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
    });
    this.fetchDegrees();
    this.fetchPlans(this.selectedDegree$);
  };
}
