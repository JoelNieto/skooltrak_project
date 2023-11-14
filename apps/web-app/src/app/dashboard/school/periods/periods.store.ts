import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Period, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import {
  combineLatestWith,
  filter,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

type State = {
  LOADING: boolean;
  PERIODS: Period[];
};

@Injectable()
export class SchoolPeriodsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);
  private readonly translate = inject(TranslateService);

  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PERIODS = this.selectSignal((state) => state.PERIODS);

  private readonly fetchPeriods = this.effect<void>((trigger$) =>
    trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([, school_id]) =>
        from(
          this.supabase.client
            .from(Table.Periods)
            .select('*')
            .eq('school_id', school_id)
            .order('start_at', { ascending: true }),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Period[];
          }),
          tapResponse(
            (PERIODS) => this.patchState({ PERIODS }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    ),
  );

  public readonly savePeriod = this.effect(
    (request$: Observable<Partial<Period>>) =>
      request$
        .pipe(
          tap(() => this.patchState({ LOADING: true })),
          switchMap((request) =>
            from(
              this.supabase.client
                .from(Table.Periods)
                .upsert([
                  { ...request, school_id: this.auth.CURRENT_SCHOOL_ID() },
                ]),
            ).pipe(
              map(({ error }) => {
                if (error) throw new Error(error.message);
                return {};
              }),
            ),
          ),
        )
        .pipe(
          tapResponse(
            () => {
              this.alert.showAlert({
                icon: 'success',
                message: this.translate.instant('ALERT.SUCCESS'),
              });
              this.patchState({ LOADING: false });
              this.fetchPeriods();
            },
            (error) => {
              this.alert.showAlert({
                icon: 'error',
                message: this.translate.instant('ALERT.FAILURE'),
              });
              console.error(error);
            },
          ),
        ),
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({ LOADING: false, PERIODS: [] });
    this.fetchPeriods();
  };
}
