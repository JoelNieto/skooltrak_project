import { User } from '../auth';

export type Message = {
  id: string;
  text: string;
  chat_id?: string;
  user_id?: string;
  user: Partial<User>;
  mine?: boolean;
  sent_at?: Date;
};
