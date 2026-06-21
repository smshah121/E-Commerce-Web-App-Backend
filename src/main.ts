import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // converts string to number, boolean, etc.
      },
    }),
  );
  app.enableCors({
    origin: ['https://pricetag-tech.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // allows cookies/auth headers
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(
    '/payment/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // crucial for cloud deployment
  console.log(`Backend running on port ${port}`);
}
bootstrap();
