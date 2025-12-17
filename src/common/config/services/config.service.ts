import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../dtos';

@Injectable()
export class ConfigService extends NestConfigService<EnvironmentVariables, true> {
  get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T] {
    return super.get(key, { infer: true });
  }
}

/**
 * @description For decorators there are possibility to use singleton pattern
 * e.g. for decorators, where DI is not possible.
 */
@Injectable()
export class SingletonConfigService implements OnModuleInit {
  private static instance: SingletonConfigService;
  private readonly logger = new Logger(SingletonConfigService.name);

  constructor(private readonly configService: ConfigService) {
    SingletonConfigService.instance = this;
  }

  onModuleInit() {
    this.logger.log('SingletonConfigService initialized');
  }

  static getInstance(): SingletonConfigService {
    if (!SingletonConfigService.instance) {
      throw new Error('SingletonConfigService not initialized.');
    }
    return SingletonConfigService.instance;
  }

  get<T extends keyof EnvironmentVariables>(property: T): EnvironmentVariables[T] {
    if (!this.configService) {
      throw new Error('ConfigService is not initialized in SingletonConfigService');
    }
    return this.configService.get(property);
  }
}
