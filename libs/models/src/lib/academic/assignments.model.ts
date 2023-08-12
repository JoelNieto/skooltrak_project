import { EntityBase } from '../entity';
import { StudyPlan } from './study-plans.model';

export type AssignmentType = {
  id: string;
  name: string;
  is_urgent: boolean;
  is_summative: string;
};

export type Assignment = EntityBase & {
  school_id: string;
  type_id: string;
  type?: AssignmentType;
  plan_id: string;
  plan?: StudyPlan;
  title: string;
  start_date: Date;
  description: string;
  upload_file: boolean;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
};
