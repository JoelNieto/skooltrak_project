import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Course, GroupAssignments, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import {
  addDays,
  addWeeks,
  endOfDay,
  getDate,
  isBefore,
  isMonday,
  isSameDay,
  isWeekend,
  nextMonday,
  nextSunday,
  previousMonday,
  startOfDay,
  subWeeks,
} from 'date-fns';

type State = {
  loading: boolean;
  assignments: GroupAssignments;
  currentDate: Date;
  courses: Course[];
  courseId: string;
};

const initial: State = {
  loading: false,
  assignments: [],
  currentDate: new Date(),
  courses: [],
  courseId: '',
};

export const ScheduleStore = signalStore(
  withState(initial),
  withComputed(({ currentDate }) => {
    const start = computed(() => {
      if (isMonday(currentDate())) {
        return startOfDay(currentDate());
      }

      if (isWeekend(currentDate())) {
        return startOfDay(nextMonday(currentDate()));
      }

      return startOfDay(previousMonday(currentDate()));
    });

    const end = computed(() => endOfDay(nextSunday(start())));
    const days = computed(() => {
      {
        let current = start();
        const dayList = [];
        while (isBefore(current, end())) {
          dayList.push({ date: current, day: getDate(current) });
          current = addDays(current, 1);
        }

        return dayList;
      }
    });

    const isToday = computed(() => isSameDay(new Date(), currentDate()));

    return { start, end, days, isToday };
  }),
  withMethods(
    ({ currentDate, ...state }, supabase = inject(SupabaseService)) => {
      function nextWeek(): void {
        patchState(state, { currentDate: addWeeks(currentDate(), 1) });
      }

      function previousWeek(): void {
        patchState(state, { currentDate: subWeeks(currentDate(), 1) });
      }

      function goToday(): void {
        patchState(state, { currentDate: new Date() });
      }

      async function getAssignments(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.GroupAssignments)
          .select(
            'group_id, group:school_groups(id, name), assignment:assignments(*), date, created_at',
          );

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { assignments: data as unknown as GroupAssignments });
      }

      /*  fetchAssignments: rxMethod<typeof queryData>(
      pipe(
        tap(() => patchState(state, { loading: true })),
        filter(() => !!queryItem() && !!queryValue()),
        switchMap(() =>
          from(
            supabase.client
              .from(Table.AssignmentsView)
              .select(
                'id, title, description, user_email, user_name, user_avatar, course_id, subject_name, plan_id, plan_name, group_id, group_name, date, type, type_id',
              )
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              .eq(queryItem()!, queryValue())
              .gte('date', format(startDate(), 'yyyy-MM-dd HH:mm:ss'))
              .lte('date', format(endDate(), 'yyyy-MM-dd HH:mm:ss')),
          ).pipe(
            map(({ data, error }) => {
              if (error) throw new Error(error.message);

              return data.map((assignment) => ({
                id: assignment.id,
                title: `${assignment.subject_name} (${assignment.group_name}): ${assignment.title}`,
                start: addHours(new Date(assignment.date), 13),
                meta: { assignment },
              }));
            }),
            tapResponse({
              next: (assignments) => patchState(state, { assignments }),
              error: console.error,
              finalize: () => patchState(state, { loading: false }),
            }),
          ),
        ),
      ),
    ), */

      return { nextWeek, previousWeek, getAssignments, goToday };
    },
  ),
);
