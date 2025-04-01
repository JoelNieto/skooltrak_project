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
import {
  addWeeks,
  format,
  isMonday,
  isWeekend,
  nextMonday,
  nextSunday,
  previousMonday,
  startOfDay,
  subWeeks,
} from 'date-fns';
import { filter, pipe, tap } from 'rxjs';

import { CoursesStore } from './courses.store';

type State = {
  loading: boolean;
  currentDate: Date;
  assignments: AssignmentView[];
  error: boolean;
};
const initialState: State = {
  loading: false,
  currentDate: new Date(),
  assignments: [],
  error: false,
};

export const CourseAssignmentStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed(({ currentDate }, courses = inject(CoursesStore)) => {
    const startDate = computed(() =>
      isWeekend(currentDate()) || isMonday(currentDate())
        ? isMonday(currentDate())
          ? startOfDay(currentDate())
          : nextMonday(currentDate())
        : previousMonday(currentDate()),
    );
    const endDate = computed(() => nextSunday(startDate()));
    const start = computed(() => format(startDate(), 'yyyy-MM-dd'));
    const end = computed(() => format(endDate(), 'yyyy-MM-dd'));
    const courseId = computed(() => courses.selectedId());
    const query = computed(() => ({
      start: startDate(),
      end: endDate(),
      courseId: courseId(),
    }));

    return { startDate, endDate, end, start, courseId, query };
  }),
  withMethods(
    (
      { currentDate, start, end, courseId, query, ...state },
      supabase = inject(SupabaseService),
      auth = inject(mobileStore.AuthStore),
    ) => {
      function nextWeek(): void {
        patchState(state, { currentDate: addWeeks(currentDate(), 1) });
      }
      function previousWeek(): void {
        patchState(state, { currentDate: subWeeks(currentDate(), 1) });
      }
      async function fetchAssignments(): Promise<void> {
        patchState(state, { loading: true, assignments: [] });
        const { data, error } = await supabase.client
          .from(Table.AssignmentsView)
          .select('*')
          .order('date', { ascending: true })
          .eq('group_id', auth.group()?.id)
          .eq('course_id', courseId())
          .gte('date', start())
          .lte('date', end());

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { loading: false, assignments: data });
      }

      const requestAssignment = rxMethod<typeof query>(
        pipe(
          filter(() => !!courseId()),
          tap(() => fetchAssignments()),
        ),
      );

      return { nextWeek, previousWeek, fetchAssignments, requestAssignment };
    },
  ),
  withHooks({
    onInit({ requestAssignment, query }) {
      requestAssignment(query);
    },
  }),
);
