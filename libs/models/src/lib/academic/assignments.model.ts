import { Course, EntityBase, User } from '@skooltrak/models';

export type AssignmentType = {
  id: string;
  name: string;
  is_urgent: boolean;
  is_summative: string;
};

export type Assignment = EntityBase & {
  type_id: string;
  type?: AssignmentType;
  course_id: string;
  course?: Partial<Course>;
  title: string;
  dates?: [{ group: { id: string; name: string }; start_at: Date }];
  description: string;
  upload_file?: boolean;
  user_id?: string;
  user?: Partial<User>;
  created_at?: Date;
  updated_at?: Date;
};

export type AssignmentView = {
  id: string;
  title: string;
  description: string;
  type_id: string;
  type: string;
  group_id: string;
  group_name: string;
  course_id: string;
  subject_id: string;
  subject_name: string;
  plan_id: string;
  plan_name: string;
  user_email: string;
  user_name: string;
  user_avatar: string;
  start_at: string;
};

export type GroupAssignment = {
  assignment_id: string;
  group_id: string;
  start_at: Date;
};
