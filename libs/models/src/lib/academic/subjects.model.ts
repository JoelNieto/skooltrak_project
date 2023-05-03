import { EntityBase } from '../entity';

export type Subject = EntityBase & {
  name: string;
  short_name: string;
  code: string;
};
