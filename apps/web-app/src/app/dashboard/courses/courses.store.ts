import { computed, inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/store';
import { ClassGroup, Course, Table } from '@skooltrak/models';
import { EMPTY, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  COURSES: Course[];
  SELECTED_ID?: string;
  COUNT: number;
  PAGE_SIZE: number;
  START: number;
  LOADING: boolean;
  GROUPS: Partial<ClassGroup>[];
};

@Injectable()
export class CoursesStore extends ComponentStore<State> implements OnStoreInit {
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly school = this.auth.CURRENT_SCHOOL_ID;
  private readonly supabase = inject(SupabaseService);

  public readonly COURSES = this.selectSignal((state) => state.COURSES);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly start$ = this.select((state) => state.START);
  public readonly START = this.selectSignal((state) => state.START);
  private END = computed(() => this.START() + (this.PAGE_SIZE() - 1));
  public readonly SELECTED_ID = this.selectSignal((state) => state.SELECTED_ID);
  public readonly SELECTED = this.selectSignal((state) =>
    state.SELECTED_ID
      ? state.COURSES.find((x) => x.id === state.SELECTED_ID)
      : null,
  );

  public readonly groups = this.selectSignal((state) => state.GROUPS);
  public readonly selected$ = this.select((state) =>
    state.SELECTED_ID
      ? state.COURSES.find((x) => x.id === state.SELECTED_ID)
      : null,
  );

  private readonly fetchCourses = this.effect(() => {
    return this.start$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((start) => {
        return from(
          this.supabase.client
            .from(Table.Courses)
            .select(
              'id, school_id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), period:periods(*), period_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
              {
                count: 'exact',
              },
            )
            .range(start, this.END()),
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { COURSES: data as unknown as Course[], COUNT: count };
          }),
          tap(({ COUNT }) => !!COUNT && this.patchState({ COUNT })),
          tapResponse(
            ({ COURSES }) => this.patchState({ COURSES }),
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

  public readonly saveCourse = this.effect(
    (request$: Observable<Partial<Course>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Courses)
              .upsert([{ ...request, school_id: this.school() }]),
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
              return EMPTY;
            }),
          );
        }),
        tapResponse(
          () => this.fetchCourses(),
          (error) => console.error(error),
          () => this.patchState({ LOADING: false }),
        ),
      );
    },
  );

  private readonly fetchGroups = this.effect(() => {
    return this.selected$.pipe(
      filter((course) => !!course),
      switchMap((course) => {
        return from(
          this.supabase.client
            .from(Table.Groups)
            .select(
              'id, name, plan:school_plans(*), degree:school_degrees(*), created_at, updated_at',
            )
            .eq('plan_id', course?.plan_id),
        )
          .pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as Partial<ClassGroup>[];
            }),
          )
          .pipe(
            tapResponse(
              (GROUPS) => this.patchState({ GROUPS }),
              (error) => console.error(error),
            ),
          );
      }),
    );
  });

  public ngrxOnStoreInit = (): void =>
    this.setState({
      COURSES: [],
      GROUPS: [],
      LOADING: true,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
    });
}
