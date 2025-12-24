import { createNestApp } from '@common/utils';
import { Logger } from '@nestjs/common';
import { env } from 'process';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('App Bootstrap');

  const app = await createNestApp({
    appModule: AppModule,
    http: {
      cors: ['*'],
    },
    swagger: {
      code: 'main',
      title: 'Test App PJ',
      description: 'The Test App PJ API description',
      version: '1.0',
    },
    usePassport: true,
    isSentryEnabled: false,
  });

  const port = env.PORT ?? 3000;

  await app.listen(port, () => {
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`🟢 Swagger is running on: http://localhost:${port}/swagger`);
  });
}

void bootstrap();
