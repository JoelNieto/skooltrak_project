import { School } from '../academic';

export type Role = {
  id?: string;
  name?: string;
  code?: string;
  links: Link[];
};

export type UserRole = {
  role: Role;
  school: School;
};

export type Link = {
  name?: string;
  icon?: string;
  route?: string;
};

export type SchoolRole = {
  roles?: Role;
  schools?: School;
};

export enum RoleEnum {
  Administrator = 'administrator',
  AccountingAdmin = 'accounting_admin',
  CollectionAdmin = 'collection_admin',
  AcademicAdmin = 'academic_admin',
  Teacher = 'teacher',
  Parent = 'parent',
  Student = 'student',
}
