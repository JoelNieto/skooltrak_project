import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Table, User } from '@skooltrak/models';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  currentUsers: Partial<User>[];
  currentQuery: string;
  selectedUsers: string[];
  loading: boolean;
};

@Injectable()
export class UsersSearchStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  supabase = inject(SupabaseService);
  readonly users = this.selectSignal((state) => state.currentUsers);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly query$ = this.select((state) => state.currentQuery, {
    debounce: true,
  });

  private readonly fetchUsers = this.effect((query$: Observable<string>) => {
    return query$.pipe(
      tap(() => this.patchState({ currentUsers: [] })),
      filter((query) => query.length > 3),
      tap(() => this.patchState({ loading: true })),
      switchMap((query) => {
        return from(
          this.supabase.client
            .from(Table.Users)
            .select('id, first_name, father_name, email, avatar_url')
            .order('first_name', { ascending: true })
            .order('father_name', { ascending: true })
            .ilike('users_query', `%${query}%`)
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Partial<User>[];
          }),
          tapResponse(
            (users) => this.patchState({ currentUsers: users }),
            (error) => console.error(error),
            () => this.patchState({ loading: false })
          )
        );
      })
    );
  });

  ngrxOnStoreInit = () => {
    this.setState({
      currentUsers: [],
      currentQuery: '',
      selectedUsers: [],
      loading: false,
    });
    this.fetchUsers(this.query$);
  };
}
