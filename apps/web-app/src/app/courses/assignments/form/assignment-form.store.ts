import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Assignment, AssignmentType, ClassGroup, Course, Table } from '@skooltrak/models';
import { exhaustMap, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  types: AssignmentType[];
  courses: Course[];
  course_id: string | undefined;
  groups: Partial<ClassGroup>[];
  loading: boolean;
};

@Injectable()
export class AssignmentFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  supabase = inject(SupabaseService);
  readonly types = this.selectSignal((state) => state.types);
  readonly groups = this.selectSignal((state) => state.groups);
  readonly courses = this.selectSignal((state) => state.courses);
  readonly course$ = this.select((state) =>
    state.courses.find((x) => x.id === state.course_id)
  );

  readonly fetchTypes = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.AssignmentTypes)
        .select('id, name, is_urgent, is_summative')
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as AssignmentType[]);
        })
      )
      .pipe(
        tapResponse(
          (types) => this.patchState({ types }),
          (error) => console.error(error)
        )
      );
  });

  readonly fetchGroups = this.effect(
    (course$: Observable<Course | undefined>) => {
      return course$.pipe(
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
    }
  );

  readonly fetchCourses = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Courses)
        .select(
          'id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at'
        )
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Course[];
      }),
      tapResponse(
        (courses) => this.patchState({ courses }),
        (error) => {
          console.error(error);
          return of([]);
        }
      )
    );
  });

  readonly saveAssignment = this.effect(
    (request$: Observable<Partial<Assignment>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Assignments)
              .upsert([{ ...request }])
          );
        })
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      types: [],
      courses: [],
      loading: false,
      groups: [],
      course_id: undefined,
    });
    this.fetchGroups(this.course$);
  };
}
