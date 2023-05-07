import { ApiProperty } from '@nestjs/swagger';
import { School } from '@skooltrak/models';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateSchoolDto implements Partial<DtoBase<School>> {
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

  @ApiProperty()
  @IsBoolean()
  is_public: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  contact_email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  contact_phone?: string;
}
