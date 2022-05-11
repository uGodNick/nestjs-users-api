import { IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  userId: number;

  @IsString()
  @IsEmail()
  userEmail: string;

  @IsString()
  userName: string;
}
