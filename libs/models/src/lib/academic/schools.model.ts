import { EntityBase } from '../entity';
import { Level } from './levels.model';

export type School = EntityBase & {
  full_name: string;
  short_name: string;
  logo_url: string;
  website: string;
  address: string;
  motto: string;
  contact_email: string;
  contact_phone: string;
  levels: Level[];
  is_public: boolean;
  active: boolean;
};
