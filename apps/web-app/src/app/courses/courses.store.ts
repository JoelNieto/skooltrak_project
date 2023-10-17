import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { ClassGroup, Course, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { EMPTY, exhaustMap, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

/* eslint-disable rxjs/finnish */
type State = {
  courses: Course[];
  selectedId?: string;
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
  groups: Partial<ClassGroup>[];
};

@Injectable()
export class CoursesStore extends ComponentStore<State> implements OnStoreInit {
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly school = this.auth.CURRENT_SCHOOL_ID;
  private readonly supabase = inject(SupabaseService);
  private readonly util = inject(UtilService);

  public readonly courses = this.selectSignal((state) => state.courses);
  public readonly count = this.selectSignal((state) => state.count);
  public readonly loading = this.selectSignal((state) => state.loading);
  public readonly pageSize = this.selectSignal((state) => state.pageSize);
  public readonly start$ = this.select((state) => state.start);
  public readonly end$ = this.select((state) => state.end);
  public readonly selectedId = this.selectSignal((state) => state.selectedId);
  public readonly selected = this.selectSignal((state) =>
    state.selectedId
      ? state.courses.find((x) => x.id === state.selectedId)
      : null
  );

  public readonly groups = this.selectSignal((state) => state.groups);
  public readonly selected$ = this.select((state) =>
    state.selectedId
      ? state.courses.find((x) => x.id === state.selectedId)
      : null
  );

  private setCourses = this.updater(
    (state, courses: Course[]): State => ({
      ...state,
      courses,
    })
  );

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      count,
      pages: this.util.getPages(count, 10),
    })
  );

  public setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      start: start,
      end: start + (state.pageSize - 1),
    })
  );

  private readonly fetchCoursesData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchCourses = this.effect(() => {
    return this.fetchCoursesData$.pipe(
      tap(() => this.patchState({ loading: true })),
      filter(({ end }) => end > 0),
      switchMap(({ start, end }) => {
        return from(
          this.supabase.client
            .from(Table.Courses)
            .select(
              'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
              {
                count: 'exact',
              }
            )
            .range(start, end)
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { courses: data, count };
          }),
          tap(({ count }) => !!count && this.setCount(count)),
          tapResponse(
            ({ courses }) => this.setCourses(courses as unknown as Course[]),
            (error) => {
              console.error(error);
              return of([]);
            },
            () => this.patchState({ loading: false })
          )
        );
      })
    );
  });

  public readonly saveCourse = this.effect(
    (request$: Observable<Partial<Course>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Courses)
              .upsert([{ ...request, school_id: this.school() }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchCourses(),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  private readonly fetchGroups = this.effect(() => {
    return this.selected$.pipe(
      filter((course) => !!course),
      switchMap((course) => {
        return from(
          this.supabase.client
            .from(Table.Groups)
            .select(
              'id, name, plan:school_plans(*), degree:school_degrees(*), created_at, updated_at'
            )
            .eq('plan_id', course?.plan_id)
        )
          .pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as Partial<ClassGroup>[];
            })
          )
          .pipe(
            tapResponse(
              (groups) => this.patchState({ groups }),
              (error) => console.error(error)
            )
          );
      })
    );
  });

  public ngrxOnStoreInit = (): void =>
    this.setState({
      courses: [],
      groups: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 10,
      start: 0,
      end: 9,
    });
}
