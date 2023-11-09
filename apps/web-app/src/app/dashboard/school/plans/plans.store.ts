import { computed, inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { StudyPlan, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { combineLatestWith, exhaustMap, filter, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  PLANS: StudyPlan[];
  COUNT: number;
  PAGE_SIZE: number;
  START: number;
  LOADING: boolean;
};

@Injectable()
export class SchoolStudyPlansStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);

  public readonly PLANS = this.selectSignal((state) => state.PLANS);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly PAGE_SIZE$ = this.select((state) => state.PAGE_SIZE);
  public readonly START$ = this.select((state) => state.START);
  public readonly START = this.selectSignal((state) => state.START);
  public readonly END = computed(() => this.START() + (this.PAGE_SIZE() - 1));

  private readonly fetchStudyPlansData$ = this.select(
    {
      START: this.START$,
      PAGE_SIZE: this.PAGE_SIZE$,
    },
    { debounce: true }
  );

  private readonly fetchStudyPlans = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() => this.fetchStudyPlansData$),
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      tap(() => this.patchState({ LOADING: true })),
      filter(([, school_id]) => !!school_id),
      switchMap(([{ START }, school_id]) => {
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
            .range(START, this.END())
            .eq('school_id', school_id)
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { PLANS: data as unknown as StudyPlan[], count };
          }),
          tap(({ count }) => !!count && this.patchState({ COUNT: count })),
          tapResponse(
            ({ PLANS }) => this.patchState({ PLANS }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false })
          )
        );
      })
    );
  });

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
              () => this.fetchStudyPlans()
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
            () => this.fetchStudyPlans()
          )
        )
      )
    )
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      PLANS: [],
      LOADING: true,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
    });
    this.fetchStudyPlans();
  };
}
