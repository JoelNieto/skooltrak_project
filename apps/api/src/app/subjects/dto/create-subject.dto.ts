import { ApiProperty } from '@nestjs/swagger';
import { Subject } from '@skooltrak/models';
import { IsOptional, IsString } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateSubjectDto implements DtoBase<Subject> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  short_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  code: string;
}
