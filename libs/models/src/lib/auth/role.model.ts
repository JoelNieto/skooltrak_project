import { School, User } from '@skooltrak/models';

import { RoleEnum, StatusEnum } from '../enums';

export type Role = {
  id?: string;
  name?: string;
  code?: RoleEnum;
  links?: Link[];
};

export type Link = {
  sort: number;
  name: string;
  icon?: string;
  route?: string;
};

export type SchoolRole = {
  id?: string;
  role?: Role;
  school?: Partial<School>;
};

export type SchoolUser = {
  school_id: string;
  user_id: string;
  role: RoleEnum;
  status: StatusEnum;
  created_at: Date;
  user?: Partial<User>;
  school: Partial<School>;
};
