import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Assignment, Table } from '@skooltrak/models';
import { filter, from, map, switchMap, tap } from 'rxjs';

type State = {
  assignment_id: string | undefined;
  assignment: Assignment | undefined;
  loading: boolean;
};

@Injectable()
export class AssignmentDetailsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  public readonly assignment_id$ = this.select((state) => state.assignment_id);
  public readonly assignment = this.selectSignal((state) => state.assignment);

  readonly fetchAssignment = this.effect(() => {
    return this.assignment_id$.pipe(
      filter((id) => !!id),
      tap(() => this.patchState({ loading: true })),
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
              (assignment) => this.patchState({ assignment }),
              (error) => console.error(error),
              () => this.patchState({ loading: false })
            )
          );
      })
    );
  });

  ngrxOnStoreInit = () => {
    this.setState({
      assignment: undefined,
      assignment_id: undefined,
      loading: false,
    });
  };
}
