import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { StudyPlan, Subject, Table } from '@skooltrak/models';
import { SupabaseService, authState } from '@skooltrak/store';

type State = {
  subjects: Subject[];
  plans: Partial<StudyPlan>[];
};

const initialState: State = {
  subjects: [],
  plans: [],
};

export const CoursesFormStore = signalStore(
  withState(initialState),
  withMethods(
    (
      state,
      auth = inject(authState.AuthStateFacade),
      supabase = inject(SupabaseService),
    ) => ({
      async fetchPlans(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.StudyPlans)
          .select('id,name')
          .eq('school_id', auth.CURRENT_SCHOOL_ID())
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
          .eq('school_id', auth.CURRENT_SCHOOL_ID())
          .order('name', { ascending: true });
        if (error) {
          console.error(error);
        }
        patchState(state, { subjects: data as unknown as Subject[] });
      },
    }),
  ),
  withHooks({
    onInit({ fetchPlans, fetchSubjects }) {
      fetchPlans();
      fetchSubjects();
    },
  }),
);
