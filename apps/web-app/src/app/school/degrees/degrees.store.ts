/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Degree, Table } from '@skooltrak/models';
import { AlertService, ConfirmationService, UtilService } from '@skooltrak/ui';
import { combineLatestWith, filter, from, map, Observable, switchMap, tap } from 'rxjs';

/* eslint-disable rxjs/finnish */
type State = {
  DEGREES: Degree[];
  COUNT: number;
  PAGES: number;
  PAGE_SIZE: number;
  START: number;
  END: number;
  LOADING: boolean;
};

@Injectable()
export class SchoolDegreesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  auth = inject(authState.AuthStateFacade);
  supabase = inject(SupabaseService);
  alert = inject(AlertService);
  util = inject(UtilService);
  confirmation = inject(ConfirmationService);

  readonly DEGREES = this.selectSignal((state) => state.DEGREES);
  readonly COUNT = this.selectSignal((state) => state.COUNT);
  readonly LOADING = this.selectSignal((state) => state.LOADING);
  readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  readonly start$ = this.select((state) => state.START);
  readonly end$ = this.select((state) => state.END);

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      COUNT: count,
      PAGES: this.util.getPages(count, 10),
    })
  );

  setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      START: start,
      END: start + (state.PAGE_SIZE - 1),
    })
  );

  readonly fetchDegreesData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.PAGE_SIZE),
    },
    { debounce: true }
  );

  private readonly fetchDegrees = this.effect(
    (request$: typeof this.fetchDegreesData$) => {
      return request$.pipe(
        combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
        tap(() => this.patchState({ LOADING: true })),
        filter(([{ end }, school_id]) => end > 0 && !!school_id),
        switchMap(([{ start, end }, school_id]) => {
          return from(
            this.supabase.client
              .from(Table.Degrees)
              .select('id, name, created_at, level:levels(*), level_id', {
                count: 'exact',
              })
              .order('name', { ascending: true })
              .range(start, end)
              .eq('school_id', school_id)
          ).pipe(
            map(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return { degrees: data, count };
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ degrees }) =>
                this.patchState({ DEGREES: degrees as unknown as Degree[] }),
              (error) => {
                console.error(error);
              },
              () => this.patchState({ LOADING: false })
            )
          );
        })
      );
    }
  );

  public readonly saveDegree = this.effect(
    (request$: Observable<Partial<Degree>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Degrees)
              .upsert([
                { ...request, school_id: this.auth.CURRENT_SCHOOL_ID() },
              ])
          ).pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
            }),
            tapResponse(
              () => {
                this.alert.showAlert({
                  icon: 'success',
                  message: 'ALERT.SUCCESS',
                });
              },
              () =>
                this.alert.showAlert({
                  icon: 'error',
                  message: 'ALERT.FAILURE',
                }),
              () => {
                this.fetchDegrees(this.fetchDegreesData$);
              }
            )
          );
        })
      );
    }
  );

  public readonly deleteDegree = this.effect((id: Observable<string>) => {
    return id.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((id) =>
        from(
          this.supabase.client.from(Table.Degrees).delete().eq('id', id)
        ).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
          }),
          tapResponse(
            () =>
              this.alert.showAlert({
                icon: 'success',
                message: 'ALERT.SUCCESS',
              }),
            () =>
              this.alert.showAlert({
                icon: 'error',
                message: 'ALERT.FAILURE',
              }),
            () => {
              this.fetchDegrees(this.fetchDegreesData$);
            }
          )
        )
      )
    );
  });

  ngrxOnStoreInit = () => {
    this.setState({
      DEGREES: [],
      LOADING: true,
      PAGES: 0,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
      END: 4,
    });
    this.fetchDegrees(this.fetchDegreesData$);
  };
}
