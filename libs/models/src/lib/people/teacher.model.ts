import { EntityBase, User } from '@skooltrak/models';

export type Teacher = EntityBase &
  Partial<User> & {
    school_id: string;
    subjects?: string[];
  };
