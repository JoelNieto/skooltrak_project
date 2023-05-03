import { EntityBase } from '../entity';
import { StudyPlan } from './study-plans.model';
import { Subject } from './subjects.model';

export type Course = EntityBase & {
  subject: Subject;
  description?: string;
  parent_subject?: Subject;
  plan: StudyPlan;
  active: boolean;
  weekly_hours: number;
};
