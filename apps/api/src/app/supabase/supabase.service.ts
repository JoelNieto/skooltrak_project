import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly config: ConfigService
  ) {}

  getClient() {
    this.logger.log('Getting supabase client...');
    if (this.clientInstance) {
      this.logger.log('Client exists - returning for current Scope.REQUEST');
      return this.clientInstance;
    }

    this.logger.log('Initializing new supabase client for new Scope.REQUEST');

    this.clientInstance = createClient(
      this.config.get('SUPABASE_URL'),
      this.config.get('SUPABASE_KEY'),
      {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            Authorization: ExtractJwt.fromAuthHeaderAsBearerToken()(
              this.request
            ),
          },
        },
      }
    );
    this.logger.log('Auth has been set!');
    return this.clientInstance;
  }
}
