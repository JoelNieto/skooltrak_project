import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SupabaseGuard } from './supabase.guard';
import { SupabaseService } from './supabase.service';
import { SupabaseStrategy } from './supabase.strategy';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService, SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseService, SupabaseStrategy, SupabaseGuard],
})
export class SupabaseModule {}
