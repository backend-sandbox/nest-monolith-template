import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService, SingletonConfigService } from './services';
import { validateConfig } from './utils';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      validate: validateConfig,
    }),
  ],
  providers: [ConfigService, SingletonConfigService],
  exports: [ConfigService, SingletonConfigService],
})
export class ConfigModule {}
