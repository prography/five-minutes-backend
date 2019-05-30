import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsString()
  @IsNotEmpty()
  passwordConfirmation!: string;
  @IsString()
  @IsNotEmpty()
  nickname!: string;
  @IsUrl()
  githubUrl!: string;
  @IsArray()
  tags!: string[];
}
