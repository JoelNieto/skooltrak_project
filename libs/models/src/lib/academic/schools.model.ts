import { Country, EntityBase, Level } from '@skooltrak/models';

export type School = EntityBase & {
  full_name?: string;
  short_name: string;
  crest_url?: string;
  website?: string;
  address?: string;
  motto?: string;
  contact_email: string;
  contact_phone: string;
  levels: Level[];
  active: boolean;
  type: SchoolType;
  country_id: string;
  country: Country;
  profile?: { full_name: string };
};

export enum SchoolType {
  Private = 'Private',
  Public = 'Public',
}
