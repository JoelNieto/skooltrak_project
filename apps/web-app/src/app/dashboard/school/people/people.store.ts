import { computed, inject } from '@angular/core';
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
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  people: SchoolProfile[];
  selectedStatus: StatusEnum | 'all';
  selectedRole: RoleEnum | 'all';
  count: number;
  pageSize: number;
  start: number;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initialState: State = {
  loading: false,
  people: [],
  selectedStatus: 'all',
  selectedRole: 'all',
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
};

export const SchoolPeopleStore = signalStore(
  withState(initialState),
  withComputed(
    (
      {
        selectedRole,
        selectedStatus,
        start,
        pageSize,
        sortColumn,
        sortDirection,
      },
      auth = inject(webStore.AuthStore),
    ) => ({
      fetchData: computed(() => ({
        role: selectedRole(),
        status: selectedStatus(),
        schoolId: auth.schoolId(),
        end: start() + (pageSize() - 1),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      })),
    }),
  ),
  withMethods(
    (
      {
        fetchData,
        selectedRole,
        selectedStatus,
        sortColumn,
        sortDirection,
        start,
        ...state
      },
      supabase = inject(SupabaseService),
    ) => {
      const fetchPeople = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!fetchData().schoolId),
          tap(() => getPeople()),
        ),
      );

      async function getPeople(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.SchoolUsers)
          .select(
            'user_id, role, status, created_at, user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
            {
              count: 'exact',
            },
          )
          .range(start(), fetchData().end)
          .eq('school_id', fetchData().schoolId);
        query =
          selectedRole() !== 'all' ? query.eq('role', selectedRole()) : query;
        query =
          selectedStatus() !== 'all'
            ? query.eq('status', selectedStatus())
            : query;
        if (sortColumn()) {
          query = query.order(sortColumn(), {
            ascending: sortDirection() !== 'desc',
          });
        }
        const { data, error, count } = await query;
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        patchState(state, {
          people: data as SchoolProfile[],
          count: count ?? 0,
          loading: false,
        });
      }

      return { fetchPeople, getPeople };
    },
  ),
  withHooks({
    onInit({ fetchData, fetchPeople }) {
      fetchPeople(fetchData);
    },
  }),
);
