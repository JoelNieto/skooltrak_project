import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
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
import { Question, QuestionTypeEnum, Quiz, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { debounceTime, distinctUntilChanged, filter, pipe, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

type State = {
  loading: boolean;
  quizId: string;
  title: string;
  description: string;
  questions: Question[];
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
  withComputed(
    ({ questions, title, description }, auth = inject(webStore.AuthStore)) => ({
      questionsCount: computed(() => questions().length),
      schoolId: computed(() => auth.schoolId()),
      fetchData: computed(() => ({
        title: title(),
        description: description(),
        questions: questions(),
      })),
    }),
  ),
  withMethods(
    (
      { quizId, questions, title, description, fetchData, schoolId, ...state },
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => {
      async function getQuiz(id: string): Promise<Quiz | undefined> {
        const { data, error } = await supabase.client
          .from(Table.Quizzes)
          .select(
            'id, title, description, questions(id, school_id, text, hint, type, user_id, created_at, options:question_options(id, text, is_correct))',
          )
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);

          return;
        }
        const { title, description, questions } = data;
        patchState(state, {
          quizId: id,
          title,
          description,
          questions,
        });

        return data;
      }
      function addQuestion(): void {
        patchState(state, {
          questions: [
            ...questions(),
            {
              text: '',
              hint: '',
              school_id: schoolId()!,
              id: uuidv4(),
              type: QuestionTypeEnum.SHORT_TEXT,
            },
          ],
        });
      }

      function updateQuestion(idx: number, question: Partial<Question>): void {
        patchState(state, {
          questions: questions().map((x, i) =>
            i === idx ? { ...x, ...question } : x,
          ),
          isUpdated: true,
        });
      }

      async function removeQuestion(index: number): Promise<void> {
        const question = questions()[index];
        const { error } = await supabase.client
          .from(Table.Questions)
          .delete()
          .eq('id', question.id);

        if (error) {
          console.error(error);

          return;
        }
        patchState(state, {
          isUpdated: true,
          questions: questions().filter((_, i) => i !== index),
        });
      }

      async function saveQuiz(): Promise<void> {
        patchState(state, { loading: true });
        const request: Partial<Quiz> = {
          title: title(),
          description: description(),
          school_id: schoolId(),
          updated_at: new Date(),
          id: quizId(),
        };

        const { error, data } = await supabase.client
          .from(Table.Quizzes)
          .upsert([request])
          .select('id')
          .single();

        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }
        try {
          await saveQuestions();
          await saveQuizQuestions();
          await saveQuestionOptions();
        } catch (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }
        toast.success(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false, quizId: data.id });
      }

      async function saveQuestions(): Promise<void> {
        const { error } = await supabase.client.from(Table.Questions).upsert(
          questions().map((x) => ({
            type: x.type,
            text: x.text,
            hint: x.hint,
            id: x.id,
            school_id: schoolId(),
          })),
        );

        if (error) {
          throw new Error(error.message);
        }
      }

      async function saveQuizQuestions(): Promise<void> {
        const { error } = await supabase.client
          .from(Table.QuizQuestions)
          .upsert(
            questions().map((x) => ({ quiz_id: quizId(), question_id: x.id })),
          );

        if (error) {
          throw new Error(error.message);
        }
      }

      async function saveQuestionOptions(): Promise<void> {
        const options = questions()
          .map(
            (x) =>
              x.options?.map((y) => ({
                id: y.id,
                question_id: x.id,
                text: y.text,
                is_correct: y.is_correct,
              })),
          )
          .flat();

        if (!options.length) {
          return;
        }

        const { error } = await supabase.client
          .from(Table.QuestionOptions)
          .upsert(options);

        if (error) {
          throw new Error(error.message);
        }
      }

      async function removeOption(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.QuestionOptions)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(error);
        }
      }

      const updateQuiz = rxMethod<typeof fetchData>(
        pipe(
          debounceTime(2000),
          filter(() => state.isUpdated()),
          distinctUntilChanged(),
          tap(() => saveQuiz()),
        ),
      );

      return {
        addQuestion,
        removeQuestion,
        updateQuestion,
        getQuiz,
        updateQuiz,
        removeOption,
      };
    },
  ),
  withHooks({
    onInit({ fetchData, updateQuiz }) {
      updateQuiz(fetchData);
    },
  }),
);
