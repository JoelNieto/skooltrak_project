import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Quiz, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

type State = {
  loading: boolean;
  quiz: Partial<Quiz> | undefined;
  previewMode: boolean;
};
const initial: State = {
  loading: false,
  quiz: undefined,
  previewMode: false,
};
export const QuizResponseStore = signalStore(
  withState(initial),
  withMethods((state, supabase = inject(SupabaseService)) => {
    async function getQuiz(id: string): Promise<void> {
      patchState(state, { loading: true });
      const { data, error } = await supabase.client
        .from(Table.Quizzes)
        .select(
          'id, title, description, questions(id, text, hint, type, options:question_options(id, text, is_correct))',
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        patchState(state, { loading: false });

        return;
      }

      patchState(state, { loading: false, quiz: data as Quiz });
    }

    return { getQuiz };
  }),
);
