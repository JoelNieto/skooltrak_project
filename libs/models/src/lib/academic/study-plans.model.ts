import { EntityBase } from '../entity';
import { Degree } from './degrees.model';
import { Level } from './levels.model';

export type StudyPlan = EntityBase & {
  name: string;
  school_id?: string;
  level_id: string;
  level?: Level;
  degree?: Degree;
  degree_id: string;
  year: number;
};
