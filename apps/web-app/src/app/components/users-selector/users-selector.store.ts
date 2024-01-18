import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Table, User } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { debounceTime, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  filteredUsers: Partial<User>[];
  selectedUsers: Partial<User>[];
  queryText: string;
  loading: boolean;
};

const initialState: State = {
  filteredUsers: [],
  selectedUsers: [],
  queryText: '',
  loading: false,
};

export const UsersSelectorStore = signalStore(
  withState(initialState),
  withMethods(
    (
      { queryText, ...state },
      auth = inject(webStore.AuthStore),
      supabase = inject(SupabaseService),
    ) => ({
      fetchUsers: rxMethod<string>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          debounceTime(1000),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Users)
                .select('id, first_name, father_name, email, avatar_url')
                .neq('id', auth.userId())
                .limit(10)
                .order('first_name', { ascending: true })
                .order('father_name', { ascending: true })
                .ilike('users_query', `%${queryText()}%`),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as Partial<User>[];
              }),
              tapResponse({
                next: (users) => patchState(state, { filteredUsers: users }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ fetchUsers, queryText }) {
      fetchUsers(queryText);
    },
  }),
);
