import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { RoleEnum, SchoolProfile, StatusEnum, Table } from '@skooltrak/models';
import { combineLatestWith, filter, from, map, switchMap, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  PEOPLE: SchoolProfile[];
  SELECTED_STATUS: StatusEnum | 'all';
  SELECTED_ROLE: RoleEnum | 'all';
};

@Injectable()
export class SchoolPeopleStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(authState.AuthStateFacade);

  private readonly SELECTED_ROLE$ = this.select((state) => state.SELECTED_ROLE);
  private readonly SELECTED_STATUS$ = this.select(
    (state) => state.SELECTED_STATUS
  );
  public readonly PEOPLE = this.selectSignal((state) => state.PEOPLE);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);

  private readonly fetchData$ = this.select(
    {
      role: this.SELECTED_ROLE$,
      status: this.SELECTED_STATUS$,
    },
    { debounce: true }
  );

  private readonly fetchPeople = this.effect((data$: typeof this.fetchData$) =>
    data$.pipe(
      combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
      filter(([, school_id]) => !!school_id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap(([data, school_id]) => {
        let query = this.supabase.client
          .from(Table.SchoolUsers)
          .select(
            'role, status, created_at, user:users(first_name, middle_name, father_name, mother_name, email, avatar_url)'
          )
          .eq('school_id', school_id);
        query = data.role !== 'all' ? query.eq('role', data.role) : query;
        query = data.status !== 'all' ? query.eq('status', data.status) : query;
        return from(query).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as unknown as SchoolProfile[];
          }),
          tapResponse(
            (PEOPLE) => this.patchState({ PEOPLE }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false })
          )
        );
      })
    )
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      LOADING: false,
      PEOPLE: [],
      SELECTED_ROLE: 'all',
      SELECTED_STATUS: 'all',
    });
    this.fetchPeople(this.fetchData$);
  };
}
