import { EntityBase } from '../entity';

export type Subject = EntityBase & {
  name: string;
  description?: string;
  short_name?: string;
  code?: string;
  active: boolean;
};
