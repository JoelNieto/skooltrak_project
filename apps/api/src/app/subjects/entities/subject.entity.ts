import * as models from '@skooltrak/models';
import { Column, Entity } from 'typeorm';

import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';

@Entity({ name: 'subjects' })
export class Subject extends DbEntityBase implements ModelBase<models.Subject> {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  code: string;
}
