import { School, User } from '@skooltrak/models';

export type Role = {
  id?: string;
  name?: string;
  code?: RoleEnum;
  links?: Link[];
};

export type UserRole = Partial<User> & {
  school_id: string;
  school_name: string;
  role: RoleTypeEnum;
  school?: Partial<School>;
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

export enum RoleEnum {
  Administrator = 'admin',
  AccountingAdmin = 'accounting_admin',
  CollectionAdmin = 'collection_admin',
  AcademicAdmin = 'academic_admin',
  Teacher = 'teacher',
  Parent = 'parent',
  Student = 'student',
}

export enum RoleTypeEnum {
  Administrator = 'admin',
  Teacher = 'teacher',
  Parent = 'parent',
  Student = 'student',
}
