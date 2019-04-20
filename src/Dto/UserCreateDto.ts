import { IsEmail, IsString, IsUrl } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email!: string;
  @IsString()
  nickname!: string;
  @IsString()
  password!: string;
  @IsUrl()
  githubUrl!: string;
}
