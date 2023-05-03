import { EntityBase } from '../entity';
import { Level } from './levels.model';

export type Degree = EntityBase & {
  name: string;
  level: Level;
};
