import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from '../common/helper/env.helper';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { School } from './schools/entities/school.entity';
import { SchoolsModule } from './schools/schools.module';
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
      entities: [School],
      synchronize: true,
    }),
    SupabaseModule,
    AuthModule,
    SchoolsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
