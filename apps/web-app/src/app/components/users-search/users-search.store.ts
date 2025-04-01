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
  searchText: string;
};

const initial: State = {
  loading: false,
  people: [],
  searchText: '',
};

export const UsersSearchStore = signalStore(
  { protectedState: false }, withState(initial),
  withMethods(({ searchText, people }, auth = inject(webStore.AuthStore)) => {
    const schoolId = computed(() => auth.schoolId());
    const filteredPeople = computed(() =>
      people().filter(
        (x) =>
          x.user.first_name
            ?.toLowerCase()
            .includes(searchText().toLowerCase()) ||
          x.user.father_name
            ?.toLowerCase()
            .includes(searchText().toLowerCase()),
      ),
    );

    return { schoolId, filteredPeople };
  }),
  withMethods(({ schoolId, ...state }, supabase = inject(SupabaseService)) => {
    const fetchPeople = rxMethod<string | undefined>(
      pipe(
        filter(() => !!schoolId()),
        tap(() => getPeople()),
      ),
    );

    async function getPeople(): Promise<void> {
      const { data, error } = await supabase.client
        .from(Table.SchoolUsers)
        .select(
          'user_id, role, status, created_at, group_id, group:school_groups(name), user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
        )
        .eq('school_id', schoolId());

      if (error) {
        console.error(error);
        patchState(state, { loading: false });

        return;
      }

      patchState(state, {
        people: data as SchoolProfile[],
      });
    }

    return { fetchPeople, getPeople };
  }),
  withHooks({
    onInit({ fetchPeople, schoolId }) {
      fetchPeople(schoolId);
    },
  }),
);
