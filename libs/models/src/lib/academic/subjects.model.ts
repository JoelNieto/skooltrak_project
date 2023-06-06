import { User } from '../auth';
import { EntityBase } from '../entity';

export type Subject = EntityBase & {
  name: string;
  school_id: string;
  description?: string;
  short_name?: string;
  user?: User;
  code?: string;
};
