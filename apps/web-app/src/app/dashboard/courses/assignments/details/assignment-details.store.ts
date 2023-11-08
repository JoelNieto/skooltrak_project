import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Assignment, Table } from '@skooltrak/models';
import { filter, from, map, switchMap, tap } from 'rxjs';

type State = {
  ASSIGNMENT_ID: string | undefined;
  ASSIGNMENT: Assignment | undefined;
  LOADING: boolean;
};

@Injectable()
export class AssignmentDetailsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  public readonly ASSIGNMENT_ID$ = this.select((state) => state.ASSIGNMENT_ID);
  public readonly ASSIGNMENT = this.selectSignal((state) => state.ASSIGNMENT);

  private readonly fetchAssignment = this.effect(() => {
    return this.ASSIGNMENT_ID$.pipe(
      filter((id) => !!id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap((id) => {
        return from(
          this.supabase.client
            .from(Table.Assignments)
            .select(
              'id, title, course_id, description, type_id, type:assignment_types(*), dates:group_assignments(group:school_groups(id, name), start_at), course:courses(id, subject:school_subjects(*), plan:school_plans(*)), created_at, updated_at, user:users(email, first_name, father_name)'
            )
            .eq('id', id)
            .single()
        )
          .pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as unknown as Assignment;
            })
          )
          .pipe(
            tapResponse(
              (ASSIGNMENT) => this.patchState({ ASSIGNMENT }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false })
            )
          );
      })
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      ASSIGNMENT: undefined,
      ASSIGNMENT_ID: undefined,
      LOADING: false,
    });
  };
}