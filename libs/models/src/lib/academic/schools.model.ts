import { Country, EntityBase, Level, SchoolTypeEnum } from '@skooltrak/models';

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
  type: SchoolTypeEnum;
  country_id: string;
  country: Country;
  code?: string;
};
