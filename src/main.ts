import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvVar } from './common/config/config.instances';
import { CustomExceptionFilter } from './common/custom-exception.filter';

// import express from 'express';
async function bootstrap() {
  const port = EnvVar.getInstance.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.useGlobalFilters(new CustomExceptionFilter());
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  app.enableCors({
    origin: [
      'todo-frontend-sigma-eight.vercel.app',
      'https://todo-frontend-sigma-eight.vercel.app',
      'vercel.app',
      'localhost',
      'http://localhost',
      'http://localhost:3000',
    ],
    // origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Book club API')
    .setDescription('this is the documentation for the Book Club API')
    .setVersion('1.0')
    .addTag('version one')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(port);
  console.log(` server started Check docs@  http://localhost:${port}/swagger`);
}

bootstrap();
