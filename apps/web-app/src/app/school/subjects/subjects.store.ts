import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Subject, Table } from '@skooltrak/models';
import { AlertService, UtilService } from '@skooltrak/ui';
import { combineLatestWith, filter, from, map, Observable, switchMap, tap } from 'rxjs';

/* eslint-disable rxjs/finnish */
type State = {
  SUBJECTS: Subject[];
  COUNT: number;
  PAGES: number;
  PAGE_SIZE: number;
  START: number;
  END: number;
  LOADING: boolean;
};

@Injectable()
export class SchoolSubjectsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly util = inject(UtilService);
  private readonly alert = inject(AlertService);
  private readonly translate = inject(TranslateService);

  public readonly SUBJECTS = this.selectSignal((state) => state.SUBJECTS);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly START$ = this.select((state) => state.START);
  public readonly END$ = this.select((state) => state.END);

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      COUNT: count,
      PAGES: this.util.getPages(count, 10),
    })
  );

  public setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      START: start,
      END: start + (state.PAGE_SIZE - 1),
    })
  );

  private readonly fetchSubjectsData$ = this.select(
    {
      START: this.START$,
      END: this.END$,
      PAGE_SIZE: toObservable(this.PAGE_SIZE),
    },
    { debounce: true }
  );

  private readonly fetchSubjects = this.effect(
    (data$: typeof this.fetchSubjectsData$) => {
      return data$.pipe(
        combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
        filter(([{ END }, school_id]) => END > 0 && !!school_id),
        tap(() => this.patchState({ LOADING: true })),
        switchMap(([{ START, END }, school_id]) => {
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
              .range(START, END)
              .eq('school_id', school_id)
          ).pipe(
            map(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return { SUBJECTS: data, count };
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ SUBJECTS }) =>
                this.patchState({ SUBJECTS: SUBJECTS as unknown as Subject[] }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false })
            )
          );
        })
      );
    }
  );

  public readonly saveSubject = this.effect(
    (request$: Observable<Partial<Subject>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Subjects)
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
                  message: this.translate.instant('ALERT.SUCCESS'),
                }),
              () => {
                this.alert.showAlert({
                  icon: 'error',
                  message: this.translate.instant('ALERT.FAILURE'),
                });
              },
              () => this.fetchSubjects(this.fetchSubjectsData$)
            )
          );
        })
      );
    }
  );

  public readonly deleteSubject = this.effect((id: Observable<string>) => {
    return id.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((id) =>
        from(
          this.supabase.client.from(Table.Subjects).delete().eq('id', id)
        ).pipe(
          map(({ error }) => {
            if (error) throw new Error(error.message);
          }),
          tapResponse(
            () =>
              this.alert.showAlert({
                icon: 'success',
                message: this.translate.instant('ALERT.SUCCESS'),
              }),
            () =>
              this.alert.showAlert({
                icon: 'error',
                message: this.translate.instant('ALERT.FAILURE'),
              }),
            () => {
              this.fetchSubjects(this.fetchSubjectsData$);
            }
          )
        )
      )
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      SUBJECTS: [],
      LOADING: true,
      PAGES: 0,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
      END: 4,
    });
    this.fetchSubjects(this.fetchSubjectsData$);
  };
}
