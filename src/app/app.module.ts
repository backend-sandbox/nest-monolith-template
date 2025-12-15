import { ConfigModule, ConfigService, SingletonConfigService } from '@common/config';
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaModule } from '@prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './auth';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
            }),
          ),
        }),
      ],
    }),
    // ! typeorm config should be extracted to configs
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 9988,
      username: 'dev_user',
      password: 'dev_password',
      database: 'sandbox_typeorm_db',
      synchronize: true,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [ConfigService, SingletonConfigService],
})
export class AppModule {}
