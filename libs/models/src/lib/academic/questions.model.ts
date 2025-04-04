import { EntityBase } from '../entity';
import { QuestionTypeEnum } from '../enums';

export type Question = EntityBase & {
  school_id: string;
  text: string;
  hint?: string;
  type: QuestionTypeEnum;
  options?: Partial<QuestionOption>[];
};

export type QuestionOption = {
  id?: string;
  question_id?: string;
  is_correct: boolean;
  created_at?: Date;
  text: string;
};
