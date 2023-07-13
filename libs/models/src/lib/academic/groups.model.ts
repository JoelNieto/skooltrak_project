import { User } from '../auth';
import { EntityBase } from '../entity';
import { Degree } from './degrees.model';
import { School } from './schools.model';
import { StudyPlan } from './study-plans.model';

export type ClassGroup = EntityBase & {
  school_id: string;
  school?: Partial<School>;
  plan_id: string;
  plan?: Partial<StudyPlan>;
  degree_id: string;
  degree: Partial<Degree>;
  name: string;
  teachers?: Partial<User>[];
};
