import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import {
  Assignment,
  AssignmentType,
  Course,
  GroupAssignment,
  Table,
} from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { orderBy, pick } from 'lodash';
import {
  combineLatestWith,
  EMPTY,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

type State = {
  SELECTED_ID: string | undefined;
  ASSIGNMENT: Assignment | undefined;
  TYPES: AssignmentType[];
  COURSES: Course[];
  COURSE_ID: string | undefined;
  DATES: GroupAssignment[];
  LOADING: boolean;
};

@Injectable()
export class AssignmentFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);
  private readonly auth = inject(authState.AuthStateFacade);

  public readonly TYPES = this.selectSignal((state) => state.TYPES);
  private readonly SELECTED_ID$ = this.select((state) => state.SELECTED_ID);
  public readonly ASSIGNMENT = this.selectSignal((state) => state.ASSIGNMENT);
  public readonly DATES = this.selectSignal((state) => state.DATES);
  public readonly COURSES = this.selectSignal((state) => state.COURSES);
  public readonly COURSE$ = this.select((state) =>
    state.COURSES.find((x) => x.id === state.COURSE_ID),
  );

  private readonly fetchTypes = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        from(
          this.supabase.client
            .from(Table.AssignmentTypes)
            .select('id, name, is_urgent, is_summative'),
        )
          .pipe(
            map(({ data, error }) => {
              if (error) throw new Error(error.message);
              return data as AssignmentType[];
            }),
          )
          .pipe(
            tapResponse(
              (TYPES) => this.patchState({ TYPES }),
              (error) => console.error(error),
            ),
          ),
      ),
    );
  });

  private readonly fetchCourses = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      switchMap(([, school_id]) =>
        from(
          this.supabase.client
            .from(Table.Courses)
            .select(
              'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
            )
            .eq('school_id', school_id),
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return orderBy(data, [
              'subject.name',
              'plan.year',
            ]) as unknown as Course[];
          }),
          tapResponse(
            (COURSES) => this.patchState({ COURSES }),
            (error) => {
              console.error(error);
              return of([]);
            },
          ),
        ),
      ),
    );
  });

  public readonly saveAssignment = this.effect(
    (request$: Observable<Assignment>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Assignments)
              .upsert([
                pick(request, [
                  'id',
                  'title',
                  'description',
                  'course_id',
                  'type_id',
                ]),
              ])
              .select('id')
              .single(),
          ).pipe(
            map(({ data, error }) => {
              if (error) throw new Error(error.message);
              return data;
            }),
            tapResponse(
              ({ id }) =>
                this.saveGroupsDate({
                  groups: this.DATES(),
                  assignment_id: id,
                }),
              (error) => console.error(error),
            ),
          );
        }),
      );
    },
  );

  private readonly saveGroupsDate = this.effect(
    (
      request$: Observable<{
        groups: GroupAssignment[];
        assignment_id: string;
      }>,
    ) => {
      return request$.pipe(
        switchMap((request) => {
          let { groups } = request;
          const { assignment_id } = request;
          groups = groups.map((x) => ({ ...x, assignment_id }));
          return from(
            this.supabase.client.from(Table.GroupAssignments).upsert(groups),
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
              return EMPTY;
            }),
            tapResponse(
              () =>
                this.alert.showAlert({
                  icon: 'success',
                  message: 'Saved changes',
                }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false }),
            ),
          );
        }),
      );
    },
  );

  private readonly fetchAssignment = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.SELECTED_ID$),
      filter(([, id]) => !!id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([, id]) => {
        return from(
          this.supabase.client
            .from(Table.Assignments)
            .select('id,title,course_id,type_id,description,created_at,user_id')
            .eq('id', id)
            .single(),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Assignment;
          }),
          tapResponse(
            (ASSIGNMENT) => this.patchState({ ASSIGNMENT }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        );
      }),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      SELECTED_ID: undefined,
      ASSIGNMENT: undefined,
      TYPES: [],
      COURSES: [],
      LOADING: false,
      COURSE_ID: undefined,
      DATES: [],
    });
    this.fetchAssignment();
    this.fetchTypes();
    this.fetchCourses();
  };
}
