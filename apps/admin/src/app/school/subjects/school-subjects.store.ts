/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Subject, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { EMPTY, exhaustMap, filter, from, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  subjects: Subject[];
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class SchoolSubjectsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  auth = inject(authState.AuthStateFacade);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly subjects = this.selectSignal((state) => state.subjects);
  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);

  private setSubjects = this.updater(
    (state, subjects: Subject[]): State => ({
      ...state,
      subjects,
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

  readonly fetchSubjectsData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchSubjects = this.effect(
    (data$: Observable<{ start: number; end: number; pageSize: number }>) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        switchMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from(Table.Subjects)
              .select(
                'id,name, short_name, code, description, created_at, user:users(full_name)',
                {
                  count: 'exact',
                }
              )
              .order('name', { ascending: true })
              .range(start, end)
              .eq('school_id', this.auth.currentSchoolId())
          ).pipe(
            exhaustMap(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return of({ subjects: data, count });
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ subjects }) =>
                this.setSubjects(subjects as unknown as Subject[]),
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

  public readonly saveSubject = this.effect(
    (request$: Observable<Partial<Subject>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Subjects)
              .upsert([{ ...request, school_id: this.auth.currentSchoolId() }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchSubjects(this.fetchSubjectsData$),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      subjects: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchSubjects(this.fetchSubjectsData$);
  };
}
