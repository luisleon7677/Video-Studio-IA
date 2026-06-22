import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(4)
  inviteCode: string;
}
