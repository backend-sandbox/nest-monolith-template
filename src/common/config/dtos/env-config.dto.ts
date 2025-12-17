import { IsInt, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  NODE_ENV: string;

  @IsOptional()
  @IsInt()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  SESSION_SECRET: string;
}
