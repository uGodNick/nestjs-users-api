import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  @IsEmail()
  userEmail: string;

  @IsString()
  userPassword: string;
}
