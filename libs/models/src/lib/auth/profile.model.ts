import { Person } from '../people/people.model';

export type User = Partial<Person> & {
  id?: string;
  full_name: string;
  email: string;
  updated_at?: Date;
  avatar_url: string;
  password?: string;
};
