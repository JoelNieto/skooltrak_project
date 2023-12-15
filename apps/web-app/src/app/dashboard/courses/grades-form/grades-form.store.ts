import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Grade, GradeBucket, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';

type State = {
  grade: Partial<Grade> | undefined;
  buckets: GradeBucket[];
  loading: boolean;
};

const initialState: State = {
  grade: undefined,
  buckets: [],
  loading: false,
};

export const GradesFormStore = signalStore(
  withState(initialState),
  withMethods(
    (
      { ...state },
      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      async fetchBuckets(courseId: string): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.GradeBuckets)
          .select('id, course_id, name, weighing')
          .eq('course_id', courseId);
        if (error) {
          console.error(error);

          return;
        }
        patchState(state, { buckets: data });
      },
      async saveGrade(request: Partial<Grade>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Grades)
          .upsert([request]);

        if (error) {
          console.error();
          alert.showAlert({ icon: 'error', message: 'ALERT.FAILURE' });
          patchState(state, { loading: false });

          return;
        }
        alert.showAlert({ icon: 'success', message: 'ALERT.SUCCESS' });
        patchState(state, { loading: false });
      },
    }),
  ),
);
