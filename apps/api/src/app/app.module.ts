import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from '../common/helper/env.helper';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { DegreeModule } from './degree/degree.module';
import { Degree } from './degree/entities/degree.entity';
import { Level } from './levels/entities/level.entity';
import { LevelsModule } from './levels/levels.module';
import { School } from './schools/entities/school.entity';
import { SchoolsModule } from './schools/schools.module';
import { StudyPlan } from './study-plans/entities/study-plan.entity';
import { StudyPlansModule } from './study-plans/study-plans.module';
import { Subject } from './subjects/entities/subject.entity';
import { SubjectsModule } from './subjects/subjects.module';
import { SupabaseModule } from './supabase/supabase.module';

const envFilePath = getEnvPath(`${process.cwd()}/apps/api/src/common/env`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'joelnieto',
      database: 'skooltrak',
      entities: [School, Level, Degree, StudyPlan, Subject, Course],
      synchronize: true,
      autoLoadEntities: true,
    }),
    SupabaseModule,
    AuthModule,
    SchoolsModule,
    LevelsModule,
    DegreeModule,
    StudyPlansModule,
    SubjectsModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
