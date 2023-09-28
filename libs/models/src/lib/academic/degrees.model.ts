import { EntityBase, Level } from '@skooltrak/models';

export type Degree = EntityBase & {
  school_id?: string;
  name: string;
  level?: Level;
  level_id: string;
};
