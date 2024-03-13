import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { StudentGrade, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

import { StudentProfileStore } from '../student-profile/student-profile.store';

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

type State = {
  loading: boolean;
  grades: StudentGrade[];
};

const initial: State = {
  loading: false,
  grades: [],
};

export const ProfileGradesStore = signalStore(
  withState(initial),
  withComputed((state, profileStore = inject(StudentProfileStore)) => {
    const studentId = computed(() => profileStore.studentId());
    const subjects = computed(() => state.grades().map((x) => x.subject));
    const dataSets = computed<{ label: string; data: number[] }[]>(() =>
      state.grades().reduce((acc: any[], current) => {
        const existing = acc.findIndex((x) => x.label === current.period);

        if (existing > -1) {
          acc[existing].data.push(formatter.format(current.score));
        } else {
          acc.push({
            label: current.period,
            data: [formatter.format(current.score)],
          });
        }

        return acc;
      }, []),
    );
    const chartData = computed(() => ({
      labels: subjects(),
      datasets: dataSets(),
    }));

    return { studentId, subjects, dataSets, chartData };
  }),
  withMethods(({ studentId, ...state }, supabase = inject(SupabaseService)) => {
    async function getGrades(): Promise<void> {
      patchState(state, { loading: false });
      const { data: grades, error } = await supabase.client
        .from(Table.StudentGrades)
        .select('subject, score, period, student_id')
        .eq('student_id', studentId())
        .order('subject', { ascending: true });

      if (error) {
        console.error(error);
        patchState(state, { loading: false });

        return;
      }

      patchState(state, { grades, loading: false });
    }

    const fetchGrades = rxMethod<string | undefined>(
      pipe(
        filter(() => !!studentId()),
        tap(() => getGrades()),
      ),
    );

    return { fetchGrades };
  }),
  withHooks({
    onInit({ fetchGrades, studentId }) {
      fetchGrades(studentId);
    },
  }),
);
