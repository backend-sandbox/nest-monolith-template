import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { buildSwagger } from './swagger';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  buildSwagger({ app, service: 'main' });
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      transform: true,
    }),
  );

  const port = env.PORT ?? 3000;

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger is running on: http://localhost:${port}/api-docs`);
  });
}

void bootstrap();
