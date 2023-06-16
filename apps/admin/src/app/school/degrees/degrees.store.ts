/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Degree, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { EMPTY, exhaustMap, filter, from, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  degrees: Degree[];
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class SchoolDegreesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly degrees = this.selectSignal((state) => state.degrees);
  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);

  private setDegrees = this.updater(
    (state, degrees: Degree[]): State => ({
      ...state,
      degrees,
    })
  );

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      count,
      pages: this.util.getPages(count, 10),
    })
  );

  setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      start: start,
      end: start + (state.pageSize - 1),
    })
  );

  readonly fetchDegreesData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchDegrees = this.effect(
    (data$: Observable<{ start: number; end: number; pageSize: number }>) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        switchMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from(Table.Degrees)
              .select('id,name, created_at, level:levels(*), level_id', {
                count: 'exact',
              })
              .order('name', { ascending: true })
              .range(start, end)
              .eq('school_id', this.school()?.id)
          ).pipe(
            exhaustMap(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return of({ degrees: data, count });
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ degrees }) => this.setDegrees(degrees as unknown as Degree[]),
              (error) => {
                console.error(error);
                return of([]);
              },
              () => this.patchState({ loading: false })
            )
          );
        })
      );
    }
  );

  public readonly saveDegree = this.effect(
    (request$: Observable<Partial<Degree>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Degrees)
              .upsert([{ ...request, school_id: this.school()?.id }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchDegrees(this.fetchDegreesData$),
          (error) => console.log(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      degrees: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchDegrees(this.fetchDegreesData$);
  };
}
