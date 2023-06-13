import { EntityBase } from '../entity';
import { StudyPlan } from './study-plans.model';
import { Subject } from './subjects.model';

export type Course = EntityBase & {
  subject_id: string;
  subject?: Subject;
  description?: string;
  plan_id: string;
  plan: StudyPlan;
  school_id: string;
  weekly_hours: number;
};
