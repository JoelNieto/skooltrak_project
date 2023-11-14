import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Table, User } from '@skooltrak/models';
import { from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  FILTERED_USERS: Partial<User>[];
  SELECTED_USERS: Partial<User>[];
  QUERY_TEXT: string;
  LOADING: boolean;
};

@Injectable()
export class UsersSelectorStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);
  public readonly USERS = this.selectSignal((state) => state.FILTERED_USERS);
  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  private readonly query$ = this.select((state) => state.QUERY_TEXT, {
    debounce: true,
  });

  private readonly fetchUsers = this.effect((query$: Observable<string>) => {
    return query$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((query) => {
        return from(
          this.supabase.client
            .from(Table.Users)
            .select('id, first_name, father_name, email, avatar_url')
            .order('first_name', { ascending: true })
            .order('father_name', { ascending: true })
            .ilike('users_query', `%${query}%`),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Partial<User>[];
          }),
          tapResponse(
            (users) => this.patchState({ FILTERED_USERS: users }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        );
      }),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({
      FILTERED_USERS: [],
      SELECTED_USERS: [],
      QUERY_TEXT: '',
      LOADING: false,
    });
    this.fetchUsers(this.query$);
  };
}
