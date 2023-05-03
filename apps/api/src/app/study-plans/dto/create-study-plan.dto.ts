import { ApiProperty } from '@nestjs/swagger';
import { Degree, Level, School, StudyPlan } from '@skooltrak/models';
import { IsNotEmpty, IsString } from 'class-validator';

import { DtoBase } from '../../shared/db/base.entity';

export class CreateStudyPlanDto implements DtoBase<StudyPlan> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  school: School;
  level: Level;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  degree: Degree;
}
