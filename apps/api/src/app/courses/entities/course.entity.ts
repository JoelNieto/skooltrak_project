import * as models from '@skooltrak/models';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';
import { StudyPlan } from '../../study-plans/entities/study-plan.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity({ name: 'courses' })
export class Course extends DbEntityBase implements ModelBase<models.Course> {
  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: models.Subject;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'parent_subject_id' })
  parent_subject?: models.Subject;

  @ManyToOne(() => StudyPlan)
  @JoinColumn({ name: 'plan_id' })
  plan: models.StudyPlan;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'decimal' })
  weekly_hours: number;
}
