import { EntityBase } from '../entity';

export type School = EntityBase & {
  name: string;
  shortName: string;
  logoURL: string;
  website: string;
  address: string;
  motto: string;
};
