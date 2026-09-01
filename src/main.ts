import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BigIntInterceptor } from './core/common/interceptors/bigint.interceptor';
import { HttpExceptionFilter } from './core/common/filters/http-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: la API siempre fue consumida solo por la app nativa (RN/Expo
  // Go), que no pasa por el sandbox de CORS del navegador -- por eso
  // nunca hizo falta habilitarlo. La Device Preview web (expo start
  // --web) SÍ corre en un browser real, así que sin esto cualquier
  // fetch() a este back fallaba con un error de red genérico (bloqueado
  // por CORS antes de llegar a leer la respuesta). Se habilita acotado
  // a orígenes localhost/127.0.0.1 (cualquier puerto) -- cubre el uso
  // de desarrollo sin abrir la API a cualquier sitio de internet.
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });

  app.useGlobalInterceptors(
  new BigIntInterceptor(),
);

  // Traduce al español los errores por defecto de NestJS (pipes, guards,
  // 404 de ruta) que antes se mostraban en inglés al usuario.
  app.useGlobalFilters(new HttpExceptionFilter());
  // Validaciones globales
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    // El front valida los formularios antes de enviar, así que un error
    // de validación acá es un caso de borde (datos manipulados, versión
    // vieja de la app). class-validator devuelve mensajes en inglés por
    // defecto ("nombre must be a string", "property X should not
    // exist"...), que se le mostraban crudos al usuario. Se reemplazan
    // por un único mensaje claro en español -- los detalles técnicos
    // quedan igual en los logs del validador para el desarrollador.
    exceptionFactory: () =>
      new BadRequestException(
        'Revisa los datos ingresados: hay un campo incompleto o con un formato no válido.',
      ),
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