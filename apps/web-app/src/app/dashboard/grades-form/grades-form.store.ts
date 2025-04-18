import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Grade, GradeBucket, Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { MatSnackBar } from '@angular/material/snack-bar';

type State = {
  grade: Partial<Grade> | undefined;
  buckets: GradeBucket[];
  periods: Period[];
  loading: boolean;
};

const initialState: State = {
  grade: undefined,
  buckets: [],
  periods: [],
  loading: false,
};

export const GradesFormStore = signalStore(
  { protectedState: false }, withState(initialState),
  withMethods(
    (
      { ...state },
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      translate = inject(TranslateService),
      auth = inject(webStore.AuthStore),
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
      async fetchPeriods(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Periods)
          .select('id, name, year, start_at, end_at, school_id')
          .eq('school_id', auth.schoolId());

        if (error) {
          console.error(error);

          return;
        }
        patchState(state, { periods: data });
      },
      async saveGrade(request: Partial<Grade>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Grades)
          .upsert([request]);

        if (error) {
          console.error();
          snackBar.open(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }
        snackBar.open(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false });
      },
    }),
  ),
  withHooks({
    onInit({ fetchPeriods }) {
      fetchPeriods();
    },
  }),
);
