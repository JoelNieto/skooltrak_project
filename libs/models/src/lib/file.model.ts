import { User } from './auth';

export type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  user: Partial<User>;
  created_at: Date;
};
