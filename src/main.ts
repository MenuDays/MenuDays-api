import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Prefijo global de la API
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('MenuDays API')
    .setDescription('API REST para la plataforma MenuDays')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT') ?? 3000);

  console.log(
    `🚀 API ejecutándose en: http://localhost:${configService.get<number>('PORT') ?? 3000}/api`,
  );

  console.log(
    `📘 Swagger disponible en: http://localhost:${configService.get<number>('PORT') ?? 3000}/api/docs`,
  );
}

bootstrap();