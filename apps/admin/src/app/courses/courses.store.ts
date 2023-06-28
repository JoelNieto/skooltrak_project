/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Course, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { EMPTY, exhaustMap, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  courses: Course[];
  selectedId?: string;
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class CoursesStore extends ComponentStore<State> implements OnStoreInit {
  store$ = inject(Store);
  school = this.store$.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly courses = this.selectSignal((state) => state.courses);
  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);
  readonly selectedId = this.selectSignal((state) => state.selectedId);
  readonly selected = this.selectSignal((state) =>
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

  setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      start: start,
      end: start + (state.pageSize - 1),
    })
  );

  readonly fetchCoursesData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchCourses = this.effect(
    (data$: Observable<{ start: number; end: number; pageSize: number }>) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        switchMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from(Table.Courses)
              .select(
                'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
                {
                  count: 'exact',
                }
              )
              .range(start, end)
              .eq('school_id', this.school()?.id)
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
    }
  );

  public readonly saveCourse = this.effect(
    (request$: Observable<Partial<Course>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Courses)
              .upsert([{ ...request, school_id: this.school()?.id }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchCourses(this.fetchCoursesData$),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      courses: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchCourses(this.fetchCoursesData$);
  };
}
