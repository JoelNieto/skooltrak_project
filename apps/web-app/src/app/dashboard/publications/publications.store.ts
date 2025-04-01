import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Course, Publication, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { MatSnackBar } from '@angular/material/snack-bar';

type State = {
  loading: boolean;
  publications: Publication[];
  start: number;
  pageSize: number;
  courses: Partial<Course>[];
};

const initial: State = {
  loading: true,
  publications: [],
  start: 0,
  pageSize: 10,
  courses: [],
};

export const PublicationsStore = signalStore(
  { protectedState: false }, withState(initial),
  withComputed(({ start, pageSize }, auth = inject(webStore.AuthStore)) => {
    const schoolId = computed(() => auth.schoolId());
    const end = computed(() => start() + (pageSize() - 1));

    return { schoolId, end };
  }),
  withMethods(
    (
      { schoolId, start, end, pageSize, ...state },
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      translate = inject(TranslateService),
    ) => {
      async function getPublications(): Promise<void> {
        patchState(state, { loading: true });

        const { data, error } = await supabase.client
          .from(Table.Publications)
          .select(
            'id, body, created_at, school_id, user_id, is_pinned, user:users(id, first_name, father_name, avatar_url), course:courses(id, plan:school_plans(id, name), subject:school_subjects(id, name))',
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
          publications: [...state.publications(), ...(data as Publication[])],
        });
      }

      function paginate(): void {
        patchState(state, { start: start() + pageSize() });
        getPublications();
      }

      async function getCourses(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, plan:school_plans(id, name, year), subject:school_subjects(id, name)',
          )
          .order('subject(name)', { ascending: true })
          .order('plan(year)', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { courses: data as unknown as Course[] });
      }

      async function savePublication({
        request,
      }: {
        request: Partial<Publication>;
      }): Promise<void> {
        patchState(state, { loading: true });

        const { error, data } = await supabase.client
          .from(Table.Publications)
          .insert([{ school_id: schoolId(), ...request }])
          .select(
            'id, body, created_at, school_id, user_id, is_pinned, user:users(id, first_name, father_name, avatar_url)',
          )
          .single();

        if (error) {
          snackBar.open(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        snackBar.open(translate.instant('PUBLICATIONS.SUCCESS'));
        patchState(state, {
          loading: false,
          publications: [...[data as Publication], ...state.publications()],
        });
      }

      function removePublication(id: string): void {
        patchState(state, {
          publications: state.publications().filter((x) => x.id !== id),
        });
      }

      return {
        getPublications,
        paginate,
        savePublication,
        getCourses,
        removePublication,
      };
    },
  ),
  withHooks({
    onInit({ getCourses }) {
      getCourses();
    },
  }),
);
