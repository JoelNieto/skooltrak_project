import * as models from '@skooltrak/models';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { Level } from '../../levels/entities/level.entity';
import { DbEntityBase, ModelBase } from '../../shared/db/base.entity';

@Entity({ name: 'schools' })
export class School extends DbEntityBase implements ModelBase<models.School> {
  @Column({ nullable: false, length: 50, unique: true })
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

  @Column({ nullable: false, default: false })
  is_public: boolean;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ nullable: true })
  contact_phone: string;

  @ManyToMany(() => Level, (level) => level._id)
  @JoinTable({ name: 'school_levels' })
  levels: models.Level[];

  @Column({ default: true })
  active: boolean;
}
