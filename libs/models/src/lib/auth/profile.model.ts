import { Person, RoleEnum, StatusEnum } from '@skooltrak/models';

export type User = Partial<Person> & {
  id?: string;
  full_name?: string;
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
