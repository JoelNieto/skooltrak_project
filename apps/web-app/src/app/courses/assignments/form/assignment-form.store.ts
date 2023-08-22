import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Assignment, AssignmentType, ClassGroup, Course, GroupAssignment, Table } from '@skooltrak/models';
import { pick } from 'lodash';
import { EMPTY, exhaustMap, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  types: AssignmentType[];
  courses: Course[];
  course_id: string | undefined;
  groups: Partial<ClassGroup>[];
  dates: GroupAssignment[];
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
  readonly dates = this.selectSignal((state) => state.dates);
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

  readonly saveAssignment = this.effect((request$: Observable<Assignment>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((request) => {
        return from(
          this.supabase.client
            .from(Table.Assignments)
            .upsert([
              pick(request, ['title', 'description', 'course_id', 'type_id']),
            ])
            .select('id')
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          tapResponse(
            ({ id }) =>
              this.saveGroupsDate({ groups: this.dates(), assignment_id: id }),
            (error) => console.error(error)
          )
        );
      })
    );
  });

  readonly saveGroupsDate = this.effect(
    (
      request$: Observable<{
        groups: GroupAssignment[];
        assignment_id: string;
      }>
    ) => {
      return request$.pipe(
        switchMap((request) => {
          let { groups } = request;
          const { assignment_id } = request;
          groups = groups.map((x) => ({ ...x, assignment_id }));
          return from(
            this.supabase.client.from(Table.GroupAssignments).upsert(groups)
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
              return EMPTY;
            }),
            tapResponse(
              () => console.info('Saved'),
              (error) => console.error(error),
              () => this.patchState({ loading: false })
            )
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
      dates: [],
    });
    this.fetchGroups(this.course$);
  };
}
