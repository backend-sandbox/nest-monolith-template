import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';
import { UserPermissionDto, UserRoleDto } from './user-rbac.dto';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'wastardy',
  })
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'wastardy@example.com',
  })
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Type(() => UserRoleDto)
  roles: UserRoleDto[];

  @ApiProperty({
    description: 'The permissions assigned to the user',
    example: ['users.view', 'users.delete'],
    type: [String],
  })
  @Transform(({ value }: { value: UserPermissionDto[] }) => value.map((permission) => permission.permissionKey))
  permissions: UserPermissionDto[];

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2025-12-19T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2025-12-19T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

  static prismaSelect(args?: { withRoles?: boolean; withPermissions?: boolean }) {
    return {
      id: true,
      username: true,
      email: true,
      ...(args?.withRoles && { roles: { select: UserRoleDto.prismaSelect() } }),
      ...(args?.withPermissions && { permissions: { select: UserPermissionDto.prismaSelect() } }),
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
