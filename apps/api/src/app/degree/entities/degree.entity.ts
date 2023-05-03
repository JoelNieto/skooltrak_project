import * as models from '@skooltrak/models';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Level } from '../../levels/entities/level.entity';
import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';

@Entity({ name: 'degrees' })
export class Degree extends DbEntityBase implements ModelBase<models.Degree> {
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Level, { eager: true })
  @JoinColumn({ name: 'level_id' })
  level: Level;
}
