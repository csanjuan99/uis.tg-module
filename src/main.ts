import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import seed from '../seed';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Resource-Id',
  });

  app.useBodyParser('json', { limit: '16mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '16mb' });

  app.setGlobalPrefix('api', {
    exclude: ['/', '/docs'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('UIS TG API')
    .setDescription('The UIS TG API description')
    .setVersion('1.0.0')
    .addTag('Authentication')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000).then(() => {
    logger.log('Application listening on port 3000');
  });
  await seed();
}

bootstrap();
