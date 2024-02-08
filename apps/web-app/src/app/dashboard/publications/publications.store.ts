import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { PublicationObject, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  publications: PublicationObject[];
  start: number;
  pageSize: number;
};

const initial: State = {
  loading: true,
  publications: [],
  start: 0,
  pageSize: 10,
};

export const PublicationsStore = signalStore(
  withState(initial),
  withComputed(({ start, pageSize }, auth = inject(webStore.AuthStore)) => {
    const schoolId = computed(() => auth.schoolId());
    const end = computed(() => start() + (pageSize() - 1));

    return { schoolId, end };
  }),
  withMethods(
    (
      { schoolId, start, end, pageSize, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function getPublications(): Promise<void> {
        patchState(state, { loading: true });

        const { data, error } = await supabase.client
          .from(Table.Publications)
          .select(
            'id, title, body, created_at, school_id, user_id, roles:publication_roles!inner(role), user:users(id, first_name, father_name, avatar_url)',
          )
          .eq('school_id', schoolId())
          .range(start(), end())
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          loading: false,
          publications: [
            ...state.publications(),
            ...(data as PublicationObject[]),
          ],
        });
      }
      function paginate(): void {
        patchState(state, { start: start() + pageSize() });
        getPublications();
      }

      return { getPublications, paginate };
    },
  ),
);
