import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbstractHttpAdapter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { InternalServerExceptionFilter } from './common/exceptions/internalserver.exception.filter';
import { PrismaInterceptor } from './common/prisma/prisma.interceptor';
import { InitialiseClient } from './common/prisma/prisma.client';

export type NodePlatform = 'express' | 'fastify';

export const createExpressApp = async () => {
  return await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
};

const setupSecurity = (app: NestExpressApplication) => {
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );
  // TODO: Add rate limiting and xss protection
  app.use(hpp());
};

const setupParsers = (app: NestExpressApplication) => {
  app.use(bodyParser.json({ limit: '500kb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
};

const setupGlobalMiddleware = (
  app: NestExpressApplication,
  httpAdapter: AbstractHttpAdapter<any, any, any>,
) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new PrismaInterceptor());

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
    new InternalServerExceptionFilter(),
    // Add other filters if needed
  );
};

const setupSwagger = (app: NestExpressApplication, version: string) => {
  const kunsoleDescription = `<p><strong>Pronounced:</strong> <em>kun·sohl</em> <small>(like “console”)</small></p> <p> The <strong>Kunsole API</strong> provides a unified interface for managing communications and activity tracking. With built-in support for <strong>email</strong>, <strong>SMS</strong>, and <strong>logging</strong>, this API enables seamless integration of messaging and monitoring capabilities into your applications. </p> <p> Built for <strong>performance</strong> and <strong>simplicity</strong>, Kunsole helps streamline notification workflows, improve system observability, and ensure reliable message delivery and log tracking. </p>`;

  const config = new DocumentBuilder()
    .setTitle('Kunsole API')
    .setDescription(kunsoleDescription)
    .setVersion(version)
    // For JWT Bearer Token authentication
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header'
    }, 'JWT-auth') // This name is used to reference the security scheme
    // For API Key authentication (X-API-Key)
    .addApiKey({
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      description: 'Enter your public API key'
    }, 'API-Key')
    // For API Secret authentication (X-API-Secret)
    .addApiKey({
      type: 'apiKey',
      name: 'X-API-Secret',
      in: 'header',
      description: 'Enter your secret API key'
    }, 'API-Secret')
    .setContact('jerrydepredator', '', 'jeremiaholisa453@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    deepScanRoutes: true,
    autoTagControllers: true,
  });

  SwaggerModule.setup('api', app, document);
};

const createApp = async (): Promise<NestExpressApplication> => {
  const app = await createExpressApp();
  const config = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  const appVersion = config.get<string>('APP_VERSION') || '1';

  // Enable CORS (can be fine-tuned with config)
  app.enableCors();

  // Set Global Prefix and Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appVersion,
  });

  // Middleware and Security
  setupSecurity(app);
  setupParsers(app);
  setupGlobalMiddleware(app, httpAdapter);
  setupSwagger(app, appVersion);

  return app;
};

async function bootstrap() {
  const app = await createApp();

  const port = process.env.PORT || process.env.APP_PORT || 8000;

  InitialiseClient();

  await app.listen(port, async () => {
    console.info(
      '[WEB] ',
      '00000',
      ' -',
      new Date('07/15/2022, 12:08:21 AM'),
      ' ',
      ' LOG',
      '[main.ts]',
      `${await app.getUrl()}/api`,
    );
  });
}
bootstrap();
