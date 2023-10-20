import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { StudyPlan, Table } from '@skooltrak/models';
import { AlertService, UtilService } from '@skooltrak/ui';
import {
  combineLatestWith,
  exhaustMap,
  filter,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

type State = {
  PLANS: StudyPlan[];
  COUNT: number;
  PAGES: number;
  PAGE_SIZE: number;
  START: number;
  END: number;
  LOADING: boolean;
};

@Injectable()
export class SchoolStudyPlansStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly util = inject(UtilService);
  private readonly alert = inject(AlertService);

  public readonly PLANS = this.selectSignal((state) => state.PLANS);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly START$ = this.select((state) => state.START);
  public readonly END$ = this.select((state) => state.END);

  private setStudyPlans = this.updater(
    (state, PLANS: StudyPlan[]): State => ({
      ...state,
      PLANS,
    })
  );

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      COUNT: count,
      PAGES: this.util.getPages(count, 10),
    })
  );

  public setRange = this.updater(
    (state, START: number): State => ({
      ...state,
      START: START,
      END: START + (state.PAGE_SIZE - 1),
    })
  );

  private readonly fetchStudyPlansData$ = this.select(
    {
      START: this.START$,
      END: this.END$,
      PAGE_SIZE: toObservable(this.PAGE_SIZE),
    },
    { debounce: true }
  );

  private readonly fetchStudyPlans = this.effect(
    (data$: typeof this.fetchStudyPlansData$) => {
      return data$.pipe(
        combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
        tap(() => this.patchState({ LOADING: true })),
        filter(([{ END }, school_id]) => END > 0 && !!school_id),
        switchMap(([{ START, END }, school_id]) => {
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
              .range(START, END)
              .eq('school_id', school_id)
          ).pipe(
            map(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return { PLANS: data, count };
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ PLANS }) =>
                this.setStudyPlans(PLANS as unknown as StudyPlan[]),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false })
            )
          );
        })
      );
    }
  );

  public readonly saveStudyPlan = this.effect(
    (request$: Observable<Partial<StudyPlan>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        exhaustMap((request) => {
          return from(
            this.supabase.client
              .from(Table.StudyPlans)
              .upsert([
                { ...request, school_id: this.auth.CURRENT_SCHOOL_ID() },
              ])
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
              (error) => console.error(error),
              () => this.fetchStudyPlans(this.fetchStudyPlansData$)
            )
          );
        })
      );
    }
  );

  public readonly deletePlan = this.effect((id$: Observable<string>) =>
    id$.pipe(
      tap(() => this.patchState({ LOADING: false })),
      switchMap((id) =>
        from(
          this.supabase.client.from(Table.StudyPlans).delete().eq('id', id)
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
            (error) => {
              this.alert.showAlert({ icon: 'error', message: 'ALERT.FAILURE' });
              console.error(error);
            },
            () => this.fetchStudyPlans(this.fetchStudyPlansData$)
          )
        )
      )
    )
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      PLANS: [],
      LOADING: true,
      PAGES: 0,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
      END: 4,
    });
    this.fetchStudyPlans(this.fetchStudyPlansData$);
  };
}
