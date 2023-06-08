import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { StudyPlan, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import {
  EMPTY,
  exhaustMap,
  filter,
  from,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

type State = {
  plans: StudyPlan[];
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class SchoolStudyPlansStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly plans = this.selectSignal((state) => state.plans);
  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);

  private setStudyPlans = this.updater((state, plans: StudyPlan[]) => ({
    ...state,
    plans,
  }));

  private setCount = this.updater((state, count: number) => ({
    ...state,
    count,
    pages: this.util.getPages(count, 10),
  }));

  setRange = this.updater((state, start: number) => ({
    ...state,
    start: start,
    end: start + (state.pageSize - 1),
  }));

  readonly fetchStudyPlansData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchStudyPlans = this.effect(
    (data$: Observable<{ start: number; end: number; pageSize: number }>) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        switchMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from(Table.StudyPlans)
              .select(
                'id,name, level:levels(*), level_id, degree_id, degree:school_degrees(*), year, created_at',
                {
                  count: 'exact',
                }
              )
              .order('year', { ascending: true })
              .range(start, end)
              .eq('school_id', this.school()?.id)
          ).pipe(
            exhaustMap(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return of({ plans: data, count });
            }),
            tap(({ count }) => this.setCount(count!)),
            tapResponse(
              ({ plans }) => this.setStudyPlans(plans as StudyPlan[]),
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

  public readonly saveStudyPlan = this.effect(
    (request$: Observable<Partial<StudyPlan>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.StudyPlans)
              .upsert([{ ...request, school_id: this.school()?.id }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchStudyPlans(this.fetchStudyPlansData$),
          (error) => console.log(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      plans: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchStudyPlans(this.fetchStudyPlansData$);
  };
}
