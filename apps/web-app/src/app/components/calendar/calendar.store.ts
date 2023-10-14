/* eslint-disable rxjs/finnish */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Table } from '@skooltrak/models';
import { CalendarEvent } from 'calendar-utils';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';

type QueryItem = 'course_id' | 'group_id';
type State = {
  start_date: Date;
  end_date: Date;
  query_item: QueryItem | undefined;
  query_value: string | undefined;
  loading: boolean;
  assignments: CalendarEvent[];
};

@Injectable()
export class CalendarStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  readonly start$ = this.select((state) => state.start_date);
  readonly end$ = this.select((state) => state.end_date);
  readonly query_item$ = this.select((state) => state.query_item);
  readonly query_value$ = this.select((state) => state.query_value);
  readonly assignments = this.selectSignal((state) => state.assignments);

  readonly queryData$ = this.select(
    {
      start_date: this.start$,
      end_date: this.end$,
      query_item: this.query_item$,
      query_value: this.query_value$,
    },
    { debounce: true }
  );

  readonly fetchAssignments = this.effect(
    (
      query$: Observable<{
        start_date: Date;
        end_date: Date;
        query_item: QueryItem | undefined;
        query_value: string | undefined;
      }>
    ) => {
      return query$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ query_item, query_value }) => !!query_item && !!query_value),
        switchMap(({ query_item, query_value, start_date, end_date }) => {
          return from(
            this.supabase.client
              .from(Table.AssignmentsView)
              .select(
                'id, title, description, user_email, user_name, user_avatar, course_id, subject_name, plan_id, plan_name, group_id, group_name, start_at, type, type_id'
              )
              .eq(query_item!, query_value)
              .gte('start_at', format(start_date, 'yyyy-MM-dd HH:mm:ss'))
              .lte('start_at', format(end_date, 'yyyy-MM-dd HH:mm:ss'))
          ).pipe(
            map(({ data, error }) => {
              if (error) throw new Error(error.message);
              return data.map((assignment) => ({
                id: assignment.id,
                title: `${assignment.subject_name} (${assignment.group_name}): ${assignment.title}`,
                start: new Date(assignment.start_at),
                meta: { assignment },
              }));
            }),
            tapResponse(
              (assignments) => this.patchState({ assignments }),
              (error) => {
                console.error(error);
              },
              () => this.patchState({ loading: false })
            )
          );
        })
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      start_date: startOfMonth(new Date()),
      end_date: endOfMonth(new Date()),
      query_item: undefined,
      query_value: undefined,
      loading: false,
      assignments: [],
    });
    this.fetchAssignments(this.queryData$);
  };
}
