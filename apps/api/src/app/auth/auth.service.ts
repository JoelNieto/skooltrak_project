import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service';
import { SignUpDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  public async signUp(credentials: SignUpDTO) {
    const { email, password, full_name, admin } = credentials;

    const {
      data: { user },
      error,
    } = await this.supabase.getClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          admin,
        },
      },
    });

    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return user;
  }
}
