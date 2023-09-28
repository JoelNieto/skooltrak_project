/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { ClassGroup, Table } from '@skooltrak/models';
import { UtilService } from '@skooltrak/ui';
import { EMPTY, exhaustMap, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  groups: ClassGroup[];
  selectedId?: string;
  count: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class GroupsStore extends ComponentStore<State> implements OnStoreInit {
  auth = inject(authState.AuthStateFacade);
  supabase = inject(SupabaseService);
  util = inject(UtilService);

  readonly groups = this.selectSignal((state) => state.groups);
  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);
  readonly selectedId = this.selectSignal((state) => state.selectedId);
  readonly selected = this.selectSignal((state) =>
    state.selectedId
      ? state.groups.find((x) => x.id === state.selectedId)
      : null
  );

  private setGroups = this.updater(
    (state, groups: ClassGroup[]): State => ({
      ...state,
      groups,
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

  readonly fetchGroupsData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchGroups = this.effect(
    (data$: Observable<{ start: number; end: number; pageSize: number }>) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        switchMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from(Table.Groups)
              .select(
                'id, name, plan:school_plans(*), teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
                {
                  count: 'exact',
                }
              )
              .range(start, end)
              .eq('school_id', this.auth.currentSchoolId())
          ).pipe(
            map(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return { groups: data, count };
            }),
            tap(({ count }) => !!count && this.setCount(count)),
            tapResponse(
              ({ groups }) => this.setGroups(groups as unknown as ClassGroup[]),
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

  public readonly saveClassGroup = this.effect(
    (request$: Observable<Partial<ClassGroup>>) => {
      return request$.pipe(
        tap(() => this.patchState({ loading: true })),
        switchMap((request) => {
          return from(
            this.supabase.client
              .from(Table.Groups)
              .upsert([{ ...request, school_id: this.auth.currentSchoolId() }])
          ).pipe(
            exhaustMap(({ error }) => {
              if (error) throw new Error(error.message);
              return of(EMPTY);
            })
          );
        }),
        tapResponse(
          () => this.fetchGroups(this.fetchGroupsData$),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      groups: [],
      loading: true,
      pages: 0,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchGroups(this.fetchGroupsData$);
  };
}
