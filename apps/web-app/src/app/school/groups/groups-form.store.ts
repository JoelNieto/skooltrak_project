import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Degree, StudyPlan, Table } from '@skooltrak/models';
import { orderBy } from 'lodash';
import { combineLatestWith, exhaustMap, filter, from, map, Observable, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  DEGREES: Degree[];
  SELECTED_DEGREE_ID: string | undefined;
  PLANS: Partial<StudyPlan>[];
};

@Injectable()
export class GroupsFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(authState.AuthStateFacade);

  readonly LOADING = this.selectSignal((state) => state.LOADING);
  readonly DEGREES = this.selectSignal((state) => state.DEGREES);
  readonly PLANS = this.selectSignal((state) => state.PLANS);
  readonly SELECTED_DEGREE_ID$ = this.select(
    (state) => state.SELECTED_DEGREE_ID
  );

  readonly fetchDegrees = this.effect<void>((trigger$) =>
    trigger$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      tap(() => this.patchState({ LOADING: true })),
      exhaustMap(([, school_id]) =>
        from(
          this.supabase.client
            .from(Table.Degrees)
            .select('id, name, level:levels(id, name, sort)')
            .eq('school_id', school_id)
        )
          .pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return orderBy(data, ['level.sort']) as unknown as Degree[];
            })
          )
          .pipe(
            tapResponse(
              (DEGREES) => this.patchState({ DEGREES }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: true })
            )
          )
      )
    )
  );

  readonly fetchPlans = this.effect(
    (degree$: Observable<string | undefined>) => {
      return degree$
        .pipe(
          filter((degree) => !!degree),
          tap(() => this.patchState({ LOADING: false })),
          exhaustMap((degree) =>
            from(
              this.supabase.client
                .from(Table.StudyPlans)
                .select('id,name')
                .eq('degree_id', degree)
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);
                return data;
              })
            )
          )
        )
        .pipe(
          tapResponse(
            (PLANS) => this.patchState({ PLANS }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false })
          )
        );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      LOADING: false,
      DEGREES: [],
      SELECTED_DEGREE_ID: undefined,
      PLANS: [],
    });
    this.fetchDegrees();
    this.fetchPlans(this.SELECTED_DEGREE_ID$);
  };
}
