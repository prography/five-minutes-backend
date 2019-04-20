import { IsString, IsUrl } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  nickname!: string;
  @IsString()
  password!: string;
  @IsUrl()
  githubUrl!: string;
}
