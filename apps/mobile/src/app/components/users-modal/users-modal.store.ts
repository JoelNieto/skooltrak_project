import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Table, User } from '@skooltrak/models';
import { mobileAuthState, SupabaseService } from '@skooltrak/store';
import { debounceTime, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  users: Partial<User>[];
  queryText: string;
  loading: boolean;
};

export const UsersModalStore = signalStore(
  withState({ users: [], queryText: '', loading: true } as State),
  withComputed((_, auth = inject(mobileAuthState.MobileAuthFacade)) => ({
    userId: computed(() => auth.USER_ID()),
  })),
  withMethods(
    ({ userId, queryText, ...state }, supabase = inject(SupabaseService)) => ({
      fetchUsers: rxMethod<string>(
        pipe(
          debounceTime(1000),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Users)
                .select('id, first_name, father_name, email, avatar_url')
                .neq('id', userId())
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
                next: (users) => patchState(state, { users }),
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
