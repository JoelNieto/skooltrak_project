import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { StudentProfile, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

type State = {
  loading: boolean;
  student: StudentProfile | undefined;
  studentId: string | undefined;
};

const initial: State = {
  loading: false,
  student: undefined,
  studentId: undefined,
};

export const StudentProfileStore = signalStore(
  withState(initial),
  withMethods(({ ...state }, supabase = inject(SupabaseService)) => {
    async function fetchProfile(id: string): Promise<void> {
      patchState(state, { loading: true });
      const { data, error } = await supabase.client
        .from(Table.Users)
        .select(
          'id, first_name, middle_name, father_name, mother_name, birth_date, document_id, email, avatar_url, profile:school_users!inner(school:schools(id, short_name, full_name), group:school_groups(id,name))',
        )
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error(error);

        return;
      }

      patchState(state, {
        student: data as unknown as StudentProfile,
        loading: false,
        studentId: id,
      });
    }

    return { fetchProfile };
  }),
);
