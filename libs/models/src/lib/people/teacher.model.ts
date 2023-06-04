import { EntityBase } from '../entity';
import { Person } from './people.model';

export type Teacher = EntityBase &
  Person & {
    school_id: string;
    subjects: string[];
    user_id: string;
  };
