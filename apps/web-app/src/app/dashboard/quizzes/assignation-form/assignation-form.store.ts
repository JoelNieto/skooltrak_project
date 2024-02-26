import { Dialog } from '@angular/cdk/dialog';
import { inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { Course, Quiz, QuizAssignation, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';

type State = {
  loading: boolean;
  courses: Course[];
  quizzes: Partial<Quiz>[];
};

const initial: State = { loading: false, courses: [], quizzes: [] };

export const QuizAssignationStore = signalStore(
  withState(initial),
  withMethods(
    (
      state,
      auth = inject(webStore.AuthStore),
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
      dialog = inject(Dialog),
    ) => {
      async function getCourses(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name, year), plan_id',
          )
          .eq('school_id', auth.schoolId())
          .order('subject(name)', { ascending: true })
          .order('plan(year)', { ascending: true });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          courses: data as unknown as Course[],
          loading: false,
        });
      }
      async function getQuizzes(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Quizzes)
          .select('id, title')
          .eq('school_id', auth.schoolId())
          .order('title', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { quizzes: data });
      }

      async function saveAssignation(
        request: Partial<QuizAssignation>,
      ): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.QuizAssignations)
          .upsert([{ ...request, school_id: auth.schoolId() }]);

        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false });
        dialog.closeAll();
      }

      return { getCourses, getQuizzes, saveAssignation };
    },
  ),
  withHooks({
    onInit({ getCourses, getQuizzes }) {
      getCourses();
      getQuizzes();
    },
  }),
);
