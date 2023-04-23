import { ApiProperty } from '@nestjs/swagger';
import { SignUpCredentials } from '@skooltrak/models';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignUpDTO implements SignUpCredentials {
  @ApiProperty({
    example: 'joel@nieto.com',
    description: 'User name',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: true })
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'abcd1234', required: true })
  @IsString()
  password: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  admin: boolean;
}
