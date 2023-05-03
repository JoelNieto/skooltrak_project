import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class DbEntityBase {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ default: () => 'NOW()' })
  created_at: Date;

  @Column({ default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;
}

export type DtoBase<T> = Omit<T, '_id' | 'created_at' | 'updated_at'>;

export type ModelBase<T> = Omit<T, '_id'>;
