import { SerializeDtoInterceptor } from '@common/serialization';
import { TAppConfigMainOptions } from '@common/types';

export const DefaultAppConfigOptions: Partial<TAppConfigMainOptions> = {
  globalInterceptors: [() => new SerializeDtoInterceptor()],
  // globalFilters: [() => new GlobalExceptionFilter()],
  // globalFiltersWithHttpAdapter: [(httpAdapter: AbstractHttpAdapter) => new LockExceptionFilter(httpAdapter)],
  http: {
    cors: ['*'],
  },
  swagger: {
    code: '',
    title: '',
    description: '',
    version: '',
  },
  usePassport: true,
  isSentryEnabled: false,
};
