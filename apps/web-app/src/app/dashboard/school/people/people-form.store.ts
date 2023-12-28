import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ClassGroup, SchoolProfile, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';

type State = {
  loading: boolean;
  groups: Partial<ClassGroup>[];
  userId: string | undefined;
  currentGroupId: string | undefined;
};

const initialState: State = {
  loading: false,
  groups: [],
  userId: undefined,
  currentGroupId: undefined,
};

export const SchoolPeopleFormStore = signalStore(
  withState(initialState),
  withComputed((_, auth = inject(webStore.AuthStore)) => ({
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    (
      { schoolId, userId, ...state },
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      async fetchGroups(): Promise<void> {
        const { error, data } = await supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(*), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
          )
          .eq('school_id', schoolId());
        if (error) {
          console.error(error);

          return;
        }
        patchState(state, { groups: data as Partial<ClassGroup>[] });
      },
      async savePerson(request: Partial<SchoolProfile>): Promise<void> {
        const { status, role, user_id } = request;
        const { error } = await supabase.client
          .from(Table.SchoolUsers)
          .update({ status, role })
          .eq('user_id', user_id)
          .eq('school_id', schoolId());

        if (error) {
          console.error(error);
          alert.showAlert({
            icon: 'error',
            message: 'ALERT_FAILURE',
          });

          return;
        }

        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
      },
      async fetchStudentGroup(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.GroupStudents)
          .select('group_id, user_id, created_at')
          .eq('school_id', schoolId())
          .eq('user_id', userId());

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { currentGroupId: data[0]?.group_id });
      },

      async saveGroup(group_id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.GroupStudents)
          .upsert([{ group_id, school_id: schoolId(), user_id: userId() }]);
        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { currentGroupId: group_id });
      },
    }),
  ),
);
