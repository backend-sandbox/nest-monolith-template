import { ExceptionFilter, NestInterceptor, Type } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

export type TFactory<T> = () => T;

export type TFactoryWithArgs<T, A> = (args: A) => T;

export type TAppConfigMainOptions = {
  appModule: Type;
  globalInterceptors?: TFactory<NestInterceptor>[];
  globalFilters?: TFactory<ExceptionFilter>[];
  globalFiltersWithHttpAdapter?: TFactoryWithArgs<ExceptionFilter, AbstractHttpAdapter>[];
  http: null | {
    cors?: string[];
  };
  swagger?: null | {
    code: string;
    title: string;
    description: string;
    version: string;
  };
  usePassport: boolean;
  isSentryEnabled: boolean;
};
