import { UserDto } from '@app/user/dtos';
import { EAuthType } from '@common/enums';

export type TRequestUser = UserDto & {
  sId: string;
  sKey: string;
  _isSocket: boolean;
};

export type TGoogleAuthUser = {
  type: EAuthType;
  email: string;
  username: string;
  avatar: string;
};
