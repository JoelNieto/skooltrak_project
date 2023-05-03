import * as models from '@skooltrak/models';
import { Column, Entity, OneToMany } from 'typeorm';

import { Degree } from '../../degree/entities/degree.entity';
import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';

@Entity({ name: 'levels' })
export class Level extends DbEntityBase implements ModelBase<models.Level> {
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => Degree, (degree) => degree.level)
  degrees: Degree[];
}
