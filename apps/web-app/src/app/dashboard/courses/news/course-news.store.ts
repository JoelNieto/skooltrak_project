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
import { TranslateService } from '@ngx-translate/core';
import { Publication, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

import { CourseDetailsStore } from '../details/course-details.store';
import { MatSnackBar } from '@angular/material/snack-bar';

type State = {
  loading: boolean;
  publications: Publication[];
  error: boolean;
};

const initial: State = { loading: false, publications: [], error: false };

export const CourseNewsStore = signalStore(
  withState(initial),
  withComputed(
    (
      _,
      auth = inject(webStore.AuthStore),
      course = inject(CourseDetailsStore),
    ) => ({
      courseId: computed(() => course.courseId()),
      schoolId: computed(() => auth.schoolId()),
    }),
  ),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      translate = inject(TranslateService),
      toast = inject(MatSnackBar),
    ) => {
      async function getPublications(): Promise<void> {
        patchState(state, { loading: true, error: false });
        const { data, error } = await supabase.client
          .from(Table.Publications)
          .select(
            'id, body, created_at, school_id, user_id, is_pinned, user:users(id, first_name, father_name, avatar_url)',
          )
          .eq('course_id', state.courseId())
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          patchState(state, { loading: false, error: true });

          return;
        }

        patchState(state, {
          loading: false,
          publications: data as Publication[],
        });
      }

      const fetchPublications = rxMethod<string | undefined>(
        pipe(
          filter(() => !!state.courseId()),
          tap(() => getPublications()),
        ),
      );

      async function savePublication({
        request,
      }: {
        request: Partial<Publication>;
      }): Promise<void> {
        patchState(state, { loading: true });

        const { error, data } = await supabase.client
          .from(Table.Publications)
          .insert([
            {
              school_id: state.schoolId(),
              course_id: state.courseId(),
              ...request,
            },
          ])
          .select(
            'id, body, created_at, school_id, user_id, is_pinned, user:users(id, first_name, father_name, avatar_url)',
          )
          .single();

        if (error) {
          toast.open(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        toast.open(translate.instant('PUBLICATIONS.SUCCESS'));
        patchState(state, {
          loading: false,
          publications: [...[data as Publication], ...state.publications()],
        });
      }

      return { getPublications, fetchPublications, savePublication };
    },
  ),
  withHooks({
    onInit({ fetchPublications, courseId }) {
      fetchPublications(courseId);
    },
  }),
);
