import { EntityBase } from '../entity';

export type Charge = EntityBase & {
  code: string;
  school_id: string;
  user_id: string;
  description: string;
  notes: string;
  start_date: Date;
  due_date: Date;
  due_penalty: Date;
  amount: number;
  balance: number;
  created_by: string;
};
