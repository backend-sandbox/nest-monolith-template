import { HttpStatus } from '@nestjs/common';

export type ApiCodeEntry = {
  code: string;
  message: string;
  statusCode: HttpStatus;
  errors?: string[];
  cause?: Error | object | null;
};

export type TApiCode<T = unknown> = Error &
  T & {
    apiCode: ApiCodeEntry;
  };
