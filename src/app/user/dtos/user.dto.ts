import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserDto implements Omit<User, 'password'> {
  @IsUUID()
  id: string;

  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  static prismaSelect() {
    return {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export class UserWithPasswordDto extends UserDto {
  @IsString()
  password: string;

  static prismaSelect = () => ({
    ...UserDto.prismaSelect(),
    password: true,
  });
}

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'wastardy',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'wastardy@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Qwerty123-',
  })
  @IsString()
  password: string;
}
