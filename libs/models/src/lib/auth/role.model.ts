import { School } from '../academic';

export type Role = {
  id: string;
  name: string;
  role_access?: { access: Access }[];
};

export type UserRole = {
  role: Role;
  school: School;
};

export type Access = {
  name?: string;
  icon?: string;
  route?: string;
};
