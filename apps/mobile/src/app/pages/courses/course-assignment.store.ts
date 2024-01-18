import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addWeeks,
  isMonday,
  isWeekend,
  nextMonday,
  nextSunday,
  previousMonday,
  startOfDay,
  subWeeks,
} from 'date-fns';

type State = {
  loading: boolean;
  currentDate: Date;
  error: boolean;
};
const initialState: State = {
  loading: false,
  currentDate: new Date(),
  error: false,
};

export const CourseAssignmentStore = signalStore(
  withState(initialState),
  withComputed(({ currentDate }) => {
    const startDate = computed(() =>
      isWeekend(currentDate()) || isMonday(currentDate())
        ? isMonday(currentDate())
          ? startOfDay(currentDate())
          : nextMonday(currentDate())
        : previousMonday(currentDate()),
    );
    const endDate = computed(() => nextSunday(startDate()));
    return { startDate, endDate };
  }),
  withMethods(({ currentDate, ...state }) => ({
    nextWeek(): void {
      patchState(state, { currentDate: addWeeks(currentDate(), 1) });
    },
    previousWeek(): void {
      patchState(state, { currentDate: subWeeks(currentDate(), 1) });
    },
  })),
);
