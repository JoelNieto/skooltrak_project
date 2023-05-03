import { ApiProperty } from '@nestjs/swagger';
import { Degree, Level } from '@skooltrak/models';
import { IsOptional, IsString } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateDegreeDto implements DtoBase<Degree> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  level: Level;
}
