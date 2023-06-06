import { School } from '../academic';

export type Role = {
  id?: string;
  name?: string;
  code?: RoleEnum;
  links?: Link[];
};

export type UserRole = {
  role: Role;
  school: School;
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
