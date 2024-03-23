import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { CalendarEvent } from 'calendar-utils';
import { addHours, format } from 'date-fns';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type QueryItem = 'course_id' | 'group_id';
type State = {
  startDate: Date;
  endDate: Date;
  queryItem: QueryItem | undefined;
  queryValue: string | undefined;
  loading: boolean;
  assignments: CalendarEvent[];
};
const initialState: State = {
  startDate: new Date(),
  endDate: new Date(),
  queryItem: undefined,
  queryValue: undefined,
  loading: false,
  assignments: [],
};

export const CalendarStore = signalStore(
  withState(initialState),
  withComputed(({ startDate, endDate, queryItem, queryValue }) => ({
    queryData: computed(() => ({
      startDate: startDate(),
      endDate: endDate(),
      queryItem: queryItem(),
      queryValue: queryValue(),
    })),
  })),
  withMethods(
    (
      { queryData, startDate, endDate, queryItem, queryValue, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      fetchAssignments: rxMethod<typeof queryData>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          tap(() => console.log(queryValue())),
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
      ),
    }),
  ),
  withHooks({
    onInit({ fetchAssignments, queryData }) {
      fetchAssignments(queryData);
    },
  }),
);
