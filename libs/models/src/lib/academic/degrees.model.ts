import { EntityBase } from '../entity';
import { Level } from './levels.model';

export type Degree = EntityBase & {
  school_id: string;
  name: string;
  level?: Level;
  level_id: string;
};
