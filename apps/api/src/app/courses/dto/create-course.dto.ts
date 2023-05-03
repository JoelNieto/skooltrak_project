import { ApiProperty } from '@nestjs/swagger';
import { Course, StudyPlan, Subject } from '@skooltrak/models';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateCourseDto implements DtoBase<Course> {
  @ApiProperty()
  @IsNotEmpty()
  subject: Subject;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parent_subject?: Subject;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  plan: StudyPlan;

  @ApiProperty({ required: false })
  @IsOptional()
  active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  weekly_hours: number;
}
