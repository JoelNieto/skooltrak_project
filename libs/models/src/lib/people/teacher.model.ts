import { User } from '../auth';
import { EntityBase } from '../entity';

export type Teacher = EntityBase &
  Partial<User> & {
    school_id: string;
    subjects?: string[];
  };
