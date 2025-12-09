import { IsString, IsEmail, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsInt()
  @Min(0)
  ducks: number;
}