import { EntityBase } from '../entity';

export type Period = Readonly<
  EntityBase & {
    school_id: string;
    name: string;
    year: number;
    start_at: string;
    end_at: string;
  }
>;
