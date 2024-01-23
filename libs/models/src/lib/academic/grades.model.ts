import { Assignment, EntityBase, Period, User } from '@skooltrak/models';

export type Grade = EntityBase & {
  title: string;
  course_id: string;
  assignment_id?: string;
  start_at: Date;
  user_id: string;
  bucket_id: string;
  period_id: string;
  published: boolean;
};

export type GradeObject = Readonly<
  Grade & {
    assignment?: Partial<Assignment>;
    bucket: Partial<GradeBucket>;
    user: Partial<User>;
    period: Partial<Period>;
    items?: GradeItem[];
  }
>;

export type GradeBucket = Readonly<{
  id: string;
  course_id: string;
  name: string;
  weighing: number;
}>;

export type GradeItem = Readonly<
  EntityBase & {
    grade_id: string;
    grade?: Partial<GradeObject>;
    student_id: string;
    score: number;
    comments: string;
  }
>;
