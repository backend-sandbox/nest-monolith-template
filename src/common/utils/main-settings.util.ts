import { ConfigService } from '@common/config/services';
import { DefaultAppConfigOptions } from '@common/constants';
import { TAppConfigMainOptions } from '@common/types';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { merge } from 'lodash';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import passport from 'passport';
import { join } from 'path';
import { buildSwagger } from '../_swagger';
import { isLocal } from './environment.util';
import { SentryFilter } from './sentry.util';

export const createNestApp = async (options: TAppConfigMainOptions) => {
  const opts = mergeDefaultAppConfigOptions(options);

  const app = await NestFactory.create<NestExpressApplication>(options.appModule, {
    bodyParser: true,
    rawBody: true,
    forceCloseConnections: true,
  });

  const configService = app.get(ConfigService);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    ...(opts.globalFiltersWithHttpAdapter?.flatMap((factory) => factory(httpAdapter) ?? []) ?? []),
    ...(opts.globalFilters?.flatMap((factory) => factory() ?? []) ?? []),
  );

  app.useGlobalInterceptors(...(opts.globalInterceptors?.flatMap((factory) => factory() ?? []) ?? []));

  if (opts.isSentryEnabled) {
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }

  if (opts.http?.cors) {
    app.enableCors({
      origin: opts.http.cors,
      credentials: true,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // ! not sure about this realization
  if (opts.usePassport) {
    const SESSION_SECRET =
      configService.get('SESSION_SECRET') ?? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    app.use(
      session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: !isLocal,
          httpOnly: true,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
  }

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useStaticAssets(join(__dirname, '../', 'public'), {
    prefix: '/public',
  });

  if (opts.swagger) {
    buildSwagger({ app, options: opts.swagger });
  }

  return app;
};

function mergeDefaultAppConfigOptions(options: TAppConfigMainOptions) {
  return merge(options, DefaultAppConfigOptions, {
    deep: true,
  });
}
