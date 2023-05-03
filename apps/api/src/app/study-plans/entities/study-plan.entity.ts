import { ApiTags } from '@nestjs/swagger';
import * as models from '@skooltrak/models';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Degree } from '../../degree/entities/degree.entity';
import { Level } from '../../levels/entities/level.entity';
import { School } from '../../schools/entities/school.entity';
import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';

@ApiTags('Study plans')
@Entity({ name: 'study_plans' })
export class StudyPlan
  extends DbEntityBase
  implements ModelBase<models.StudyPlan>
{
  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => School, { eager: true })
  @JoinColumn({ name: 'school_id' })
  school: models.School;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: models.Level;

  @ManyToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree: models.Degree;
}
