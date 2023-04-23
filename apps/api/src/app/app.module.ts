import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getEnvPath } from '../common/helper/env.helper';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';

const envFilePath = getEnvPath(`${process.cwd()}/apps/api/src/common/env`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
