import {
  ClassGroup,
  Person,
  RoleEnum,
  School,
  StatusEnum,
} from '@skooltrak/models';

export type User = Partial<Person> & {
  id?: string;
  email: string;
  updated_at?: Date;
  avatar_url: string;
  password?: string;
};

export type SchoolProfile = {
  user_id?: string;
  role: RoleEnum;
  status: StatusEnum;
  created_at: Date;
  user: Partial<User>;
};

export type UserProfile = SchoolProfile & {
  group_id?: string;
};

export type StudentProfile = Partial<Person> & {
  id: string;
  profile: { group: ClassGroup; school: Partial<School> }[];
};
