import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { SchoolProfile, StudyPlan, Subject, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  subjects: Subject[];
  plans: Partial<StudyPlan>[];
  teachers: Partial<SchoolProfile>[];
};

const initialState: State = {
  subjects: [],
  plans: [],
  teachers: [],
};

export const CoursesFormStore = signalStore(
  withState(initialState),
  withMethods(
    (
      state,
      auth = inject(webStore.AuthStore),
      supabase = inject(SupabaseService),
    ) => ({
      async fetchPlans(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.StudyPlans)
          .select('id,name')
          .eq('school_id', auth.schoolId())
          .order('year', { ascending: true });

        if (error) {
          console.error(error);
        }
        patchState(state, { plans: data as Partial<StudyPlan>[] });
      },
      async fetchSubjects(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Subjects)
          .select(
            'id,name, short_name, code, description, created_at, user:users(full_name)',
          )
          .eq('school_id', auth.schoolId())
          .order('name', { ascending: true });

        if (error) {
          console.error(error);
        }
        patchState(state, { subjects: data as unknown as Subject[] });
      },
      async fetchTeachers(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.SchoolUsers)
          .select(
            'user_id, role, status, created_at, user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
            {
              count: 'exact',
            },
          )
          .or('role.eq.ADMIN, role.eq.TEACHER')
          .eq('school_id', auth.schoolId())
          .order('user(first_name)', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { teachers: data as Partial<SchoolProfile>[] });
      },
    }),
  ),
  withHooks({
    onInit({ fetchPlans, fetchSubjects, fetchTeachers }) {
      fetchPlans();
      fetchSubjects();
      fetchTeachers();
    },
  }),
);
