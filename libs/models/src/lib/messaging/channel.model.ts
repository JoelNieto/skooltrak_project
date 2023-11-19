import { User } from '../auth';
import { EntityBase } from '../entity';
import { ChannelTypeEnum } from '../enums';

export type Channel = EntityBase & {
  type: ChannelTypeEnum;
  school_id: string;
  members: ChannelMember[];
};

export type ChannelMember = {
  user_id: string;
  permission: string;
  created_at: string;
  user: User;
};
