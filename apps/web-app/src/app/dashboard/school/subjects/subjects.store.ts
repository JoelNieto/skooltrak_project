import { computed, inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { authState, SupabaseService } from '@skooltrak/store';
import { Subject, Table } from '@skooltrak/models';
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
  SUBJECTS: Subject[];
  COUNT: number;
  PAGE_SIZE: number;
  START: number;
  TEXT_SEARCH: string;
  LOADING: boolean;
};

@Injectable()
export class SchoolSubjectsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly alert = inject(AlertService);
  private readonly translate = inject(TranslateService);

  public readonly SUBJECTS = this.selectSignal((state) => state.SUBJECTS);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly TEXT_SEARCH = this.selectSignal((state) => state.TEXT_SEARCH);
  public readonly TEXT_SEARCH$ = this.select((state) => state.TEXT_SEARCH);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly PAGE_SIZE$ = this.select((state) => state.PAGE_SIZE);
  public readonly START$ = this.select((state) => state.START);
  public readonly START = this.selectSignal((state) => state.START);
  public readonly END = computed(() => this.START() + (this.PAGE_SIZE() - 1));

  private readonly fetchSubjectsData$ = this.select(
    {
      START: this.START$,
      TEXT_SEARCH: this.TEXT_SEARCH$,
      PAGE_SIZE: this.PAGE_SIZE$,
    },
    { debounce: true },
  );

  private readonly fetchSubjects = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() => this.fetchSubjectsData$),
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([{ START, TEXT_SEARCH }, school_id]) => {
        return from(
          this.supabase.client
            .from(Table.Subjects)
            .select(
              'id,name, short_name, code, description, created_at, user:users(full_name)',
              {
                count: 'exact',
              },
            )
            .order('name', { ascending: true })
            .range(START, this.END())
            .eq('school_id', school_id)
            .or(
              `name.ilike.%${TEXT_SEARCH}%, short_name.ilike.%${TEXT_SEARCH}%, code.ilike.%${TEXT_SEARCH}%, description.ilike.%${TEXT_SEARCH}%`,
            ),
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { SUBJECTS: data, count };
          }),
          tap(({ count }) => !!count && this.patchState({ COUNT: count })),
          tapResponse(
            ({ SUBJECTS }) =>
              this.patchState({ SUBJECTS: SUBJECTS as unknown as Subject[] }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        );
      }),
    );
  });

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
              ]),
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
              () => this.fetchSubjects(),
            ),
          );
        }),
      );
    },
  );

  public readonly deleteSubject = this.effect((id$: Observable<string>) => {
    return id$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((id) =>
        from(
          this.supabase.client.from(Table.Subjects).delete().eq('id', id),
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
              this.fetchSubjects();
            },
          ),
        ),
      ),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      SUBJECTS: [],
      LOADING: true,
      COUNT: 0,
      PAGE_SIZE: 5,
      TEXT_SEARCH: '',
      START: 0,
    });
    this.fetchSubjects();
  };
}
