import { Request } from 'express';
import { TRequestUser } from './auth.type';
import { TGeo } from './geo.type';

export type TUserAgent = {
  browser: string;
  os: string;
  device: string;
  deviceType: string;
  source: string;
};

export type TRequestMeta = {
  ip: string;
  isLocalhost: boolean;
  geo: TGeo;
  userAgent: TUserAgent;
};

export type RequestExt = Request & {
  user: TRequestUser;
  meta: TRequestMeta;
};
