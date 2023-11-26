import { User } from '../auth';
import { EntityBase } from '../entity';

export type Chat = EntityBase & {
  description: string;
  user_id: string;
  members: ChatMember[];
};

export type ChatMember = {
  chat_id: string;
  user_id: string;
  created_at: string;
  user: Partial<User>;
};
