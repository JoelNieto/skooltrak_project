import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudyPlan } from './entities/study-plan.entity';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlansService } from './study-plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan])],
  controllers: [StudyPlansController],
  providers: [StudyPlansService],
})
export class StudyPlansModule {}
