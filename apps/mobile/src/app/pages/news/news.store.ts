import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PublicationObject, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  news: PublicationObject[];
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
  withState(initial),
  withComputed(({ start, pageSize }, auth = inject(mobileStore.AuthStore)) => {
    const schoolId = computed(() => auth.schoolId());
    const end = computed(() => start() + (pageSize() - 1));
    const isAdmin = computed(() => auth.isAdmin());
    const isStudent = computed(() => auth.isStudent());
    const isTeacher = computed(() => auth.isTeacher());
    const group = computed(() => auth.group());

    return { schoolId, end, isAdmin, isStudent, isTeacher, group };
  }),
  withMethods(
    (
      { schoolId, start, end, pageSize, ...state },
      supabase = inject(SupabaseService),
    ) => {
      async function getNews(): Promise<void> {
        patchState(state, { loading: true });

        const { data, error } = await supabase.client
          .from(Table.Publications)
          .select(
            'id, title, body, created_at, school_id, user_id, degrees:school_degrees(id, name), plans:school_plans(id, name), user:users(id, first_name, father_name, avatar_url), is_public',
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
          news: [...state.news(), ...(data as PublicationObject[])],
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
