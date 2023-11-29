import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/store';
import { ClassGroup, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { combineLatestWith, filter, from, map, of, switchMap, tap } from 'rxjs';

type State = {
  GROUPS: ClassGroup[];
  SELECTED_ID?: string;
  COUNT: number;
  PAGES: number;
  PAGE_SIZE: number;
  START: number;
  END: number;
  LOADING: boolean;
};

@Injectable()
export class GroupsStore extends ComponentStore<State> implements OnStoreInit {
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly util = inject(UtilService);

  public readonly GROUPS = this.selectSignal((state) => state.GROUPS);
  public readonly COUNT = this.selectSignal((state) => state.COUNT);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly PAGE_SIZE = this.selectSignal((state) => state.PAGE_SIZE);
  public readonly start$ = this.select((state) => state.START);
  public readonly end$ = this.select((state) => state.END);
  public readonly SELECTED_ID = this.selectSignal((state) => state.SELECTED_ID);
  public readonly SELECTED = this.selectSignal((state) =>
    state.SELECTED_ID
      ? state.GROUPS.find((x) => x.id === state.SELECTED_ID)
      : null,
  );

  private setCount = this.updater(
    (state, count: number): State => ({
      ...state,
      COUNT: count,
      PAGES: this.util.getPages(count, 10),
    }),
  );

  public setRange = this.updater(
    (state, start: number): State => ({
      ...state,
      START: start,
      END: start + (state.PAGE_SIZE - 1),
    }),
  );

  private readonly fetchGroupsData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.PAGE_SIZE),
    },
    { debounce: true },
  );

  private readonly fetchGroups = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() => this.fetchGroupsData$),
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([{ end }, school_id]) => end > 0 && !!school_id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([{ end, start }, school_id]) => {
        return from(
          this.supabase.client
            .from(Table.Groups)
            .select(
              'id, name, plan:school_plans(*), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
              {
                count: 'exact',
              },
            )
            .range(start, end)
            .eq('school_id', school_id),
        ).pipe(
          map(({ data, error, count }) => {
            if (error) throw new Error(error.message);
            return { groups: data, count };
          }),
          tap(({ count }) => !!count && this.setCount(count)),
          tapResponse(
            ({ groups }) =>
              this.patchState({ GROUPS: groups as unknown as ClassGroup[] }),
            (error) => {
              console.error(error);
              return of([]);
            },
            () => this.patchState({ LOADING: false }),
          ),
        );
      }),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      GROUPS: [],
      LOADING: false,
      PAGES: 0,
      COUNT: 0,
      PAGE_SIZE: 5,
      START: 0,
      END: 4,
    });
    this.fetchGroups();
  };
}
