import {
  EntityBase,
  Period,
  StudyPlan,
  Subject,
  User,
} from '@skooltrak/models';

export type Course = EntityBase & {
  subject_id: string;
  subject?: Subject;
  description?: string;
  plan_id: string;
  plan: StudyPlan;
  school_id: string;
  period_id: string;
  period?: Partial<Period>;
  weekly_hours: number;
  teachers: Partial<User>[];
};
