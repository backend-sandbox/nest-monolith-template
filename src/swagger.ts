import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

type SwaggerOperation = { get: (key: string) => string };

export const buildSwagger = (args: {
  app: INestApplication;
  service: string;
}) => {
  try {
    const config = new DocumentBuilder()
      .setTitle(`My NestJS Sandbox ${args.service.toUpperCase()}`)
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(args.app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        return `${controllerKey.replace('Controller', '')}_${methodKey}`;
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      SwaggerModule.setup('swagger', args.app, document, {
        jsonDocumentUrl: 'swagger.json',
        swaggerOptions: {
          persistAuthorization: true,

          operationsSorter: (a: SwaggerOperation, b: SwaggerOperation) => {
            const order = ['get', 'post', 'put', 'patch', 'delete'];

            return (
              order.indexOf(a.get('method')) - order.indexOf(b.get('method'))
            );
          },
        },
      });
    }

    const swaggerFolder = './swagger';
    if (!fs.existsSync(swaggerFolder)) {
      fs.mkdirSync(swaggerFolder, { recursive: true });
    }
    fs.writeFileSync(
      swaggerFolder + `/${args.service.toLowerCase()}.swagger.json`,
      JSON.stringify(document),
    );
  } catch (ex) {
    console.error(ex, 'Error on swagger setup');
  }
};
