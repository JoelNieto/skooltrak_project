import { signalStore, withState } from '@ngrx/signals';
import { Question, QuestionOption } from '@skooltrak/models';

type Store = {
  loading: boolean;
  question: Partial<Question>;
  options: QuestionOption[];
};

const initial: Store = {
  loading: false,
  question: {},
  options: [],
};

export const QuestionFormStore = signalStore(withState(initial));
