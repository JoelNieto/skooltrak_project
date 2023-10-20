import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Course, Degree, StudyPlan, Table } from '@skooltrak/models';
import { AlertService, UtilService } from '@skooltrak/ui';
import { orderBy } from 'lodash';
import { combineLatestWith, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  COURSES: Partial<Course>[];
  PLANS: Partial<StudyPlan>[];
  DEGREES: Partial<Degree>[];
  SELECTED_DEGREE: string | undefined;
  SELECTED_PLAN: string | undefined;
  COUNT: number;
  PAGES: number;
  PAGE_SIZE: number;
  START: number;
  END: number;
};

@Injectable()
export class SchoolCoursesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly util = inject(UtilService);
  private readonly alert = inject(AlertService);

  public readonly COURSES = this.selectSignal((state) => state.COURSES);
  public readonly DEGREES = this.selectSignal((state) => state.DEGREES);
  public readonly PLANS = this.selectSignal((state) => state.PLANS);
  public readonly selectedDegree$ = this.select(
    (state) => state.SELECTED_DEGREE
  );
  public readonly selectedPlan$ = this.select((state) => state.SELECTED_PLAN);
  public readonly selectedPlan = this.selectSignal(
    (state) => state.SELECTED_PLAN
  );
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly start$ = this.select((state) => state.START);
  public readonly end$ = this.select((state) => state.END);

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      COUNT: count,
      PAGES: this.util.getPages(count, 10),
    })
  );

  public setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      START: start,
      END: start + (state.PAGE_SIZE - 1),
    })
  );

  private readonly fetchCoursesData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.PAGE_SIZE),
      plan: this.selectedPlan$,
    },
    { debounce: true }
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
            .eq('school_id', school_id)
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
            () => this.patchState({ LOADING: false })
          )
        )
      )
    )
  );

  private readonly fetchCourses = this.effect(() => {
    return this.fetchCoursesData$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([{ end, plan }, school_id]) => end > 0 && !!school_id && !!plan),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([{ start, end, plan }, school_id]) => {
        return from(
          this.supabase.client
            .from(Table.Courses)
            .select(
              'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
              {
                count: 'exact',
              }
            )
            .eq('school_id', school_id)
            .eq('plan_id', plan)
            .range(start, end)
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { courses: data, count };
          }),
          tap(({ count }) => !!count && this.setCount(count)),
          tapResponse(
            ({ courses }) =>
              this.patchState({ COURSES: courses as unknown as Course[] }),
            (error) => {
              console.error(error);
              return of([]);
            },
            () => this.patchState({ LOADING: false })
          )
        );
      })
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
              .eq('degree_id', degree_id)
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
              () => this.patchState({ SELECTED_PLAN: undefined, COURSES: [] })
            )
          )
        )
      )
  );

  public readonly saveCourse = this.effect(
    (request$: Observable<Partial<Course>>) =>
      request$.pipe(
        switchMap((request) =>
          from(
            this.supabase.client
              .from(Table.Courses)
              .upsert([
                { ...request, school_id: this.auth.CURRENT_SCHOOL_ID() },
              ])
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            }),
            tapResponse(
              () =>
                this.alert.showAlert({
                  icon: 'success',
                  message: 'ALERT.SUCCESS',
                }),
              () =>
                this.alert.showAlert({
                  icon: 'error',
                  message: 'ALERT.FAILURE',
                }),
              () => this.setRange(0)
            )
          )
        )
      )
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      LOADING: false,
      PLANS: [],
      COURSES: [],
      DEGREES: [],
      SELECTED_DEGREE: undefined,
      SELECTED_PLAN: undefined,
      PAGES: 0,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
      END: 4,
    });
    this.fetchDegrees();
    this.fetchPlans(this.selectedDegree$);
  };
}
