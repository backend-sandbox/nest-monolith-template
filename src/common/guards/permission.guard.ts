import { UserService } from '@app/user/services';
import { TPermissionKey } from '@common/constants';
import { ApiCode, ApiException } from '@common/exceptions';
import { TRequestUser } from '@common/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

export const PermissionGuard = (...permissionKeys: TPermissionKey[]) => {
  @Injectable()
  class PermissionGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(public readonly userService: UserService) {
      super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();

      const user = request.user as TRequestUser;

      if (user.roles.some((role) => role.role === Role.SUPER_ADMIN)) {
        return true;
      }

      const hasPermission = user.permissions.some((permission) => {
        permissionKeys.includes(permission.permissionKey as TPermissionKey); // ! remove as for type safety
      });

      if (!hasPermission) {
        throw new ApiException(ApiCode.INSUFFICIENT_PERMISSIONS);
      }

      return true;
    }
  }

  return PermissionGuard;
};
