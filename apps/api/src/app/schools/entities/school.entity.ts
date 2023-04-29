import * as models from '@skooltrak/models';
import { Column, Entity } from 'typeorm';

import { DbEntityBase, ModelBase } from '../../shared/base.entity';

@Entity({ name: 'schools' })
export class School extends DbEntityBase implements ModelBase<models.School> {
  @Column({ nullable: false })
  short_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  motto: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  website: string;
}
