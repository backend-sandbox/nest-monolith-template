import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { buildSwagger } from './swagger';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  buildSwagger({ app, service: 'main' });

  const port = env.PORT ?? 55555;

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger is running on: http://localhost:${port}/api-docs`);
  });
}

void bootstrap();
