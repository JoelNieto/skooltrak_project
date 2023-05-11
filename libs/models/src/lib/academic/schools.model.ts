import { Country } from '../country.model';
import { EntityBase } from '../entity';
import { Level } from './levels.model';

export type School = EntityBase & {
  full_name?: string;
  short_name: string;
  logo_url?: string;
  website?: string;
  address?: string;
  motto?: string;
  contact_email: string;
  contact_phone: string;
  levels: Level[];
  active: boolean;
  type: SchoolType;
  country_id: number;
  country: Country;
};

export enum SchoolType {
  Private = 'Private',
  Public = 'Public',
}
