import { ApiProperty } from '@nestjs/swagger';
import { Role, UserPermission } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The role assigned to the user',
    example: Role.ADMIN,
  })
  @IsEnum(() => Role)
  role: Role;

  static readonly prismaSelect = () => ({
    userId: true,
    role: true,
  });
}

export class UserPermissionDto implements Pick<UserPermission, 'permissionKey'> {
  @Type(() => String)
  permissionKey: string;

  static readonly prismaSelect = () => ({
    permissionKey: true,
  });
}
