import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { RoleEnum, Table, User } from '@skooltrak/models';
import { combineLatestWith, filter, from, map, Observable, switchMap } from 'rxjs';

type State = {
  LOADING: boolean;
  PEOPLE: Partial<User>[];
  SELECTED_ROLE: RoleEnum | undefined;
};

@Injectable()
export class SchoolPeopleStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly SELECTED_ROLE$ = this.select((state) => state.SELECTED_ROLE);

  public ngrxOnStoreInit = (): void =>
    this.setState({ LOADING: false, PEOPLE: [], SELECTED_ROLE: undefined });

  private readonly fetchPeople = this.effect(
    (ROLE$: Observable<RoleEnum | undefined>) =>
      ROLE$.pipe(
        combineLatestWith(this.auth.CURRENT_SCHOOL_ID$),
        filter(([, school_id]) => !!school_id),
        filter(([role]) => !!role),
        switchMap(([role, school_id]) =>
          from(
            this.supabase.client
              .from(Table.UserProfiles)
              .select('*')
              .eq('role', role)
              .eq('school_id', school_id)
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data;
            })
          )
        )
      )
  );
}
