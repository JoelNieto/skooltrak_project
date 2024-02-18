import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Question, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  quizId: string;
  title: string;
  description: string;
  questions: Partial<Question>[];
  error: boolean;
  isUpdated: boolean;
};

const initial: State = {
  loading: false,
  quizId: '',
  title: '',
  description: '',
  questions: [],
  error: false,
  isUpdated: false,
};

export const QuizzesFormStore = signalStore(
  withState(initial),
  withComputed(({ questions }, auth = inject(webStore.AuthStore)) => ({
    questionsCount: computed(() => questions().length),
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    ({ quizId, questions, ...state }, supabase = inject(SupabaseService)) => {
      async function getQuiz(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Quizzes)
          .select('id, title, description, questions(*)')
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false, error: true });

          return;
        }
        const { title, description, questions } = data;
        patchState(state, { loading: false, title, description, questions });
      }

      function addQuestion(): void {
        patchState(state, {
          questions: [...questions(), { text: '', hint: '' }],
        });
      }

      function updateQuestion(idx: number, question: Partial<Question>): void {
        patchState(state, {
          questions: questions().map((x, i) =>
            i === idx ? { ...x, ...question } : x,
          ),
        });
      }

      function removeQuestion(index: number): void {
        patchState(state, {
          questions: questions().filter((_, i) => i !== index),
        });
      }

      const fetchQuiz = rxMethod<string | undefined>(
        pipe(
          filter(() => !!quizId()),
          tap(() => getQuiz()),
        ),
      );

      return { fetchQuiz, addQuestion, removeQuestion, updateQuestion };
    },
  ),
  withHooks({
    onInit({ fetchQuiz, quizId }) {
      fetchQuiz(quizId);
    },
  }),
);
