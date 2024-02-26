import { User } from '../auth';
import { EntityBase } from '../entity';
import { Course } from './courses.model';
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

export type QuizAssignation = EntityBase & {
  course_id: string;
  course?: Partial<Course>;
  quiz_id: string;
  quiz?: Partial<Quiz>;
  school_id: string;
  start_date: string;
  end_date: string;
  hidden: boolean;
  minutes: number;
};
