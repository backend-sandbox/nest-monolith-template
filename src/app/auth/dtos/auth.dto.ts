import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from 'class-validator';
import {
  ENGLISH_LETTERS_AND_NUMBERS_REGEX,
  NO_SPECIAL_CHARS_REGEX,
  SPECIAL_CHARS_REGEX_FOR_PASSWORD,
  STRONG_PASSWORD_OPTIONS,
} from '../constants';

export class SignUpDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'wastardy',
  })
  @IsString()
  @Matches(NO_SPECIAL_CHARS_REGEX, {
    message: 'Username cannot contain special characters',
  })
  @Matches(ENGLISH_LETTERS_AND_NUMBERS_REGEX, {
    message: 'Username can only contain English letters and numbers',
  })
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(30, { message: 'Username must be at most 30 characters long' })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'wastardy@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: "User's password",
    example: 'Qwerty123-',
  })
  @IsStrongPassword(STRONG_PASSWORD_OPTIONS, {
    message:
      'The password must be at least 7 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Matches(SPECIAL_CHARS_REGEX_FOR_PASSWORD, {
    message: 'Password must contain at least one special character (e.g., !, @, #, $, etc.)',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  password: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'wastardy@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: "User's password",
    example: 'Qwerty123-',
  })
  @IsStrongPassword(STRONG_PASSWORD_OPTIONS, {
    message:
      'The password must be at least 7 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Matches(SPECIAL_CHARS_REGEX_FOR_PASSWORD, {
    message: 'Password must contain at least one special character (e.g., !, @, #, $, etc.)',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  password: string;
}
