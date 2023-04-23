import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() req: SignUpDTO) {
    Logger.log(req);
    return this.auth.signUp(req);
  }
}
