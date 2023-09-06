import { Degree, EntityBase, School, StudyPlan, User } from '@skooltrak/models';

export type ClassGroup = EntityBase & {
  school_id: string;
  school?: Partial<School>;
  plan_id: string;
  plan?: Partial<StudyPlan>;
  degree_id: string;
  degree: Partial<Degree>;
  name: string;
  teachers?: Partial<User>[];
};
