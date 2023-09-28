import { EntityBase, User } from '@skooltrak/models';

export type Subject = EntityBase & {
  name: string;
  school_id?: string;
  description?: string;
  short_name?: string;
  user?: User;
  code?: string;
};
