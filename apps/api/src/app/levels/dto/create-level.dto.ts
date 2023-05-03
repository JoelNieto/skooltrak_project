import { ApiProperty } from '@nestjs/swagger';
import { Level } from '@skooltrak/models';
import { IsString } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateLevelDto implements DtoBase<Level> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;
}
