import { HttpException } from '@nestjs/common';
import { ApiCodeEntry, TApiCode } from './types';

export const hasApiCode = <T extends object>(exception: T): exception is TApiCode<T> => {
  return 'apiCode' in exception;
};

export class ApiException extends HttpException implements TApiCode {
  constructor(
    apiCode: ApiCodeEntry,
    public readonly message: string = '',
    options?: {
      errors?: string[] | null;
      cause?: Error | object | null;
    },
  ) {
    const _apiCode = { ...apiCode } as ApiCodeEntry;

    if (message) _apiCode.message = message;
    if (options?.errors) _apiCode.errors = options.errors;
    if (options?.cause) _apiCode.cause = options.cause;

    super(_apiCode, _apiCode.statusCode, { cause: options?.cause });

    this.apiCode = _apiCode;
  }

  apiCode: ApiCodeEntry;

  getResponse(): ApiCodeEntry {
    return {
      ...this.apiCode,
    };
  }

  isApiCode(apiCode: ApiCodeEntry): boolean {
    return apiCode.code === this.apiCode.code;
  }
}
