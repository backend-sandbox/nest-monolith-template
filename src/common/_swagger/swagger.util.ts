import { TSwaggerOptions } from '@common/types';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

type SwaggerOperation = { get: (key: string) => string };

export const buildSwagger = (args: { app: INestApplication; options: TSwaggerOptions }) => {
  const { app, options } = args;

  try {
    const config = new DocumentBuilder()
      .setTitle(`${options.title ?? 'NestJS Monolith Template API'} ${options.code.toUpperCase()}`)
      .setVersion(options.version ?? '1.0')
      .setDescription(options.description ?? 'The NestJS Monolith Template API description')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        return `${controllerKey.replace('Controller', '')}_${methodKey}`;
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      SwaggerModule.setup('swagger', app, document, {
        jsonDocumentUrl: 'swagger.json',
        customCssUrl: '/public/_swagger/swagger.theme.css',
        customJs: '/public/_swagger/swagger.theme.js',

        swaggerOptions: {
          persistAuthorization: true,

          operationsSorter: (a: SwaggerOperation, b: SwaggerOperation) => {
            const order = ['get', 'post', 'put', 'patch', 'delete'];

            return order.indexOf(a.get('method')) - order.indexOf(b.get('method'));
          },

          tagsSorter: 'alpha',
        },
      });
    }

    const swaggerFolder = './swagger';
    if (!fs.existsSync(swaggerFolder)) {
      fs.mkdirSync(swaggerFolder, { recursive: true });
    }
    fs.writeFileSync(swaggerFolder + `/${options.code.toLowerCase()}.swagger.json`, JSON.stringify(document));
  } catch (ex) {
    console.error(ex, 'Error on swagger setup');
  }
};
