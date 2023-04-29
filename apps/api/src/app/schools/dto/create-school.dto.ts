import { ApiProperty } from '@nestjs/swagger';
import { School } from '@skooltrak/models';
import { IsOptional, IsString } from 'class-validator';

import { DtoBase } from '../../shared/base.entity';

export class CreateSchoolDto implements DtoBase<School> {
  @ApiProperty({ required: true })
  @IsString()
  full_name: string;

  @ApiProperty({ required: true })
  @IsString()
  short_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  logo_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  website: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  motto: string;
}
