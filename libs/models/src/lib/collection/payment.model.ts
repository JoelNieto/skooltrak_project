import { EntityBase } from '../entity';
import { PaymentMethodEnum } from '../enums';

export type Payment = EntityBase & {
  school_id: string;
  user_id: string;
  notes?: string;
  method: PaymentMethodEnum;
  amount: number;
};
