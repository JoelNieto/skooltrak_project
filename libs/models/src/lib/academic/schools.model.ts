import { EntityBase } from '../entity';

export type School = EntityBase & {
  full_name: string;
  short_name: string;
  logo_url: string;
  website: string;
  address: string;
  motto: string;
};
