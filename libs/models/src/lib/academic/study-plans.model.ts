import { Degree, EntityBase, Level } from '@skooltrak/models';

export type StudyPlan = EntityBase & {
  name: string;
  school_id?: string;
  level_id: string;
  level?: Level;
  degree?: Degree;
  degree_id: string;
  year: number;
};
