import { EntityBase } from '../entity';
import { Degree } from './degrees.model';
import { Level } from './levels.model';
import { School } from './schools.model';

export type StudyPlan = EntityBase & {
  name: string;
  school: School;
  level: Level;
  degree: Degree;
};
