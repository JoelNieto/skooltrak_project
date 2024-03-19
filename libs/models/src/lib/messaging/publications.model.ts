import { Course } from '../academic';
import { User } from '../auth';
import { EntityBase } from '../entity';

export type Publication = EntityBase & {
  body: string;
  school_id: string;
  course_id?: string;
  course?: Partial<Course>;
  is_pinned: boolean;
  user_id: string;
  user: Partial<User>;
};
