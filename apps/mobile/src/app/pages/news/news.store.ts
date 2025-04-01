import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Publication, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  news: Publication[];
  start: number;
  pageSize: number;
  filterText: string;
  filterType: 'public' | 'personal';
};

const initial: State = {
  loading: true,
  news: [],
  start: 0,
  pageSize: 10,
  filterText: '',
  filterType: 'public',
};

export const NewsStore = signalStore(
  { protectedState: false }, withState(initial),
  withComputed(({ start, pageSize }, auth = inject(mobileStore.AuthStore)) => {
    const schoolId = computed(() => auth.schoolId());
    const end = computed(() => start() + (pageSize() - 1));
    const isAdmin = computed(() => auth.isAdmin());
    const isStudent = computed(() => auth.isStudent());
    const isTeacher = computed(() => auth.isTeacher());
    const group = computed(() => auth.group());
    const role = computed(() => auth.currentRole());

    return { schoolId, end, isAdmin, isStudent, isTeacher, group, role };
  }),
  withMethods(
    (
      { schoolId, start, end, pageSize, role, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function getNews(): Promise<void> {
        patchState(state, { loading: true });

        const { data, error } = await supabase.client
          .from(Table.Publications)
          .select(
            'id, title, body, created_at, school_id, user_id, roles:publication_roles!inner(role), user:users(id, first_name, father_name, avatar_url)',
          )
          .eq('school_id', schoolId())
          .eq('roles.role', role())
          .range(start(), end())
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          loading: false,
          news: [...state.news(), ...(data as unknown as Publication[])],
        });
      }

      function paginate(): void {
        patchState(state, { start: start() + pageSize() });
        getNews();
      }

      return { getNews, paginate };
    },
  ),
);
