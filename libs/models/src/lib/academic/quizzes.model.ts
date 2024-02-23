import { User } from '../auth';
import { EntityBase } from '../entity';
import { Question } from './questions.model';

export type Quiz = EntityBase & {
  title: string;
  description?: string;
  user_id?: string;
  school_id?: string;
  questions: Question[];
};

export type QuizObject = Quiz & {
  user?: Partial<User>;
};

export type QuizQuestion = {
  question_id: string;
  question: Question;
  value: number;
  created_at: Date;
};
