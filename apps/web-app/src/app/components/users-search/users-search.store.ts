import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SchoolProfile, Table, UserProfile } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  people: UserProfile[];
  selected: UserProfile[];
  count: number;
  pageSize: number;
  start: number;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initial: State = {
  loading: false,
  people: [],
  selected: [],
  pageSize: 5,
  start: 0,
  sortDirection: '',
  sortColumn: '',
  count: 0,
};

export const UsersSearchStore = signalStore(
  withState(initial),
  withMethods(
    (
      { start, pageSize, sortColumn, sortDirection },
      auth = inject(webStore.AuthStore),
    ) => {
      const schoolId = computed(() => auth.schoolId());

      const fetchData = computed(() => ({
        schoolId: auth.schoolId(),
        end: start() + (pageSize() - 1),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      }));

      return { schoolId, fetchData };
    },
  ),
  withMethods(
    (
      {
        schoolId,
        fetchData,
        start,
        sortColumn,
        sortDirection,
        selected,
        ...state
      },
      supabase = inject(SupabaseService),
    ) => {
      const fetchPeople = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getPeople()),
        ),
      );

      async function getPeople(): Promise<void> {
        let query = supabase.client
          .from(Table.SchoolUsers)
          .select(
            'user_id, role, status, created_at, group_id, group:school_groups(name), user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
            {
              count: 'exact',
            },
          )
          .range(start(), fetchData().end)
          .eq('school_id', schoolId());

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
        });
      }

      function toggleSelected(item: UserProfile): void {
        if (selected().some((x) => x.user_id === item.user_id)) {
          patchState(state, {
            selected: selected().filter((x) => x.user_id !== item.user_id),
          });

          return;
        }

        patchState(state, { selected: [...selected(), item] });
      }

      return { fetchPeople, getPeople, toggleSelected };
    },
  ),
  withHooks({
    onInit({ fetchPeople, fetchData }) {
      fetchPeople(fetchData);
    },
  }),
);
