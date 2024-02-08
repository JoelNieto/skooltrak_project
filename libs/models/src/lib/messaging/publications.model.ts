import { User } from '../auth';
import { EntityBase } from '../entity';

export type Publication = EntityBase & {
  title: string;
  body: string;
  school_id: string;
  degree_id?: string;
  plan_id?: string;
  group_id?: string;
  is_pinned?: boolean;
  user_id: string;
};

export type PublicationObject = Publication & {
  user: Partial<User>;
};
