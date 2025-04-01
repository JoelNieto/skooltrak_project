import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Assignment, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

type State = {
  assignment: Assignment | undefined;
  loading: boolean;
};

const initialState: State = {
  assignment: undefined,
  loading: false,
};

export const AssignmentDetailsStore = signalStore(
  { protectedState: false }, withState(initialState),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      router = inject(Router),
      snackbar = inject(MatSnackBar),
      translate = inject(TranslateService),
    ) => ({
      async fetchAssignment(id: string): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Assignments)
          .select(
            'id, title, course_id, description, type_id, type:assignment_types(*), dates:group_assignments(group:school_groups(id, name), date), attachments!assignment_attachments(*), course:courses(id, subject:school_subjects(*), plan:school_plans(*)), created_at, updated_at, user:users(email, first_name, father_name)',
          )
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        patchState(state, {
          assignment: data as unknown as Assignment,
          loading: false,
        });
      },
      async deleteAssignment(id: string): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Assignments)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          snackbar.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        snackbar.open(translate.instant('ALERT.DELETED'));
        router.navigate(['/app/schedule']);
      },
    }),
  ),
);
