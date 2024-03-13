import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { ClassGroup, Table, UserProfile } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  groups: Partial<ClassGroup>[];
  userId: string | undefined;
};

const initialState: State = {
  loading: false,
  groups: [],
  userId: undefined,
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
      toast = inject(HotToastService),
      translate = inject(TranslateService),
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
      async savePerson(request: Partial<UserProfile>): Promise<void> {
        const { status, role, group_id } = request;
        const { error } = await supabase.client
          .from(Table.SchoolUsers)
          .update({ status, role, group_id })
          .eq('user_id', userId())
          .eq('school_id', schoolId());

        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
      },
    }),
  ),
);
