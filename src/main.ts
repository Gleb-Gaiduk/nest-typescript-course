import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { expressApp } from './express/server';

const expressAdapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    expressAdapter,
  );

  const configService = app.get(ConfigService);

  // Static files
  app.useStaticAssets(configService.STORAGE_ASSETS);

  // HTML views
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  // SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('Mój Projekt w Nest')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
  // END OF SWAGGER SETUP

  await app.listen(configService.PORT);
}
bootstrap();
