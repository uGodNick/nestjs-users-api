import { IsString, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  userPassword: string;
}
