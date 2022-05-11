import { IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  userId: string;

  @IsString()
  @IsEmail()
  userEmail: string;

  @IsString()
  userName: string;
}
