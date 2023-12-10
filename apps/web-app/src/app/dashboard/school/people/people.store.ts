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
import { RoleEnum, SchoolProfile, StatusEnum, Table } from '@skooltrak/models';
import { authState, SupabaseService } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  people: SchoolProfile[];
  selectedStatus: StatusEnum | 'all';
  selectedRole: RoleEnum | 'all';
  count: number;
  pageSize: number;
  start: number;
};

const initialState: State = {
  loading: false,
  people: [],
  selectedStatus: 'all',
  selectedRole: 'all',
  count: 0,
  pageSize: 5,
  start: 0,
};

export const SchoolPeopleStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { selectedRole, selectedStatus, start, pageSize },
      auth = inject(authState.AuthStateFacade),
    ) => ({
      fetchData: computed(() => ({
        role: selectedRole(),
        status: selectedStatus(),
        school_id: auth.CURRENT_SCHOOL_ID(),
        end: start() + (pageSize() - 1),
      })),
    }),
  ),
  withMethods(
    (
      { fetchData, selectedRole, selectedStatus, start, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      fetchPeople: rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!fetchData().school_id),
          tap(() => patchState(state, { loading: true })),
          switchMap(() => {
            let query = supabase.client
              .from(Table.SchoolUsers)
              .select(
                'user_id, role, status, created_at, user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
                {
                  count: 'exact',
                },
              )
              .range(start(), fetchData().end)
              .eq('school_id', fetchData().school_id);
            query =
              selectedRole() !== 'all'
                ? query.eq('role', selectedRole())
                : query;
            query =
              selectedStatus() !== 'all'
                ? query.eq('status', selectedStatus())
                : query;
            return from(query).pipe(
              map(({ error, data, count }) => {
                if (error) throw new Error(error.message);
                return {
                  people: data as unknown as SchoolProfile[],
                  count: count ?? 0,
                };
              }),
              tapResponse({
                next: ({ people, count }) =>
                  patchState(state, { people, count }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            );
          }),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ fetchData, fetchPeople }) {
      fetchPeople(fetchData);
    },
  }),
);
