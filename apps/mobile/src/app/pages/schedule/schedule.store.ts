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
import { AssignmentView, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';
import { addDays, format } from 'date-fns';
import { distinctUntilChanged, filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  date: string;
  assignments: AssignmentView[];
};

const initialState: State = {
  loading: false,
  date: format(new Date(), 'yyyy-MM-dd'),
  assignments: [],
};

export const ScheduleStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed(({ date }) => ({
    endDate: computed(() => format(addDays(new Date(date()), 1), 'yyyy-MM-dd')),
  })),
  withMethods(
    (
      { date, endDate, ...state },
      auth = inject(mobileStore.AuthStore),
      supabase = inject(SupabaseService),
    ) => {
      const fetchAssignments = rxMethod<string>(
        pipe(
          filter(() => !!date()),
          distinctUntilChanged(),
          tap(() => getAssignments()),
        ),
      );

      async function getAssignments(): Promise<void> {
        patchState(state, { loading: true, assignments: [] });
        let query = supabase.client
          .from(Table.AssignmentsView)
          .select('*')
          .eq('school_id', auth.schoolId())
          .gte('date', date())
          .lte('date', endDate());

        if (auth.isTeacher()) {
          query = query.eq('user_id', auth.userId());
        }
        if (auth.isStudent()) {
          query = query.eq('group_id', auth.group()?.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { loading: false, assignments: data });
      }

      return { fetchAssignments, getAssignments };
    },
  ),
  withHooks({
    onInit({ fetchAssignments, date }) {
      fetchAssignments(date);
    },
  }),
);
