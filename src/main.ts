import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
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
      if (
        !origin ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });

  app.useGlobalInterceptors(new BigIntInterceptor());

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
      // class-validator devuelve mensajes en inglés por defecto ("nombre
      // must be a string", "property X should not exist"...). Los DTOs que
      // el usuario completa a mano (auth, sobre todo) definen su propio
      // `message:` en español explicando EXACTAMENTE qué campo y por qué
      // falla; acá se devuelve ese mensaje tal cual, así el usuario sabe
      // si se equivocó en el correo, en la contraseña, etc. Si un DTO no
      // tiene mensajes propios (solo el default en inglés), se cae a un
      // texto genérico en español en vez de mostrar el inglés crudo.
      exceptionFactory: (errors: ValidationError[]) => {
        // Un mensaje por campo que falla. Si un campo está vacío se usa el
        // mensaje de "obligatorio" y se ignoran los otros (no tiene sentido
        // decir "muy corta" de una contraseña que ni siquiera se escribió).
        const perField: string[] = [];
        const collect = (errs: ValidationError[]) => {
          for (const err of errs) {
            if (err.constraints) {
              const c = err.constraints;
              const chosen = c.isNotEmpty ?? c.isDefined ?? Object.values(c)[0];
              if (chosen) perField.push(chosen);
            }
            if (err.children && err.children.length > 0) {
              collect(err.children);
            }
          }
        };
        collect(errors);

        // Heurística: ¿el mensaje ya está redactado en español? (los DTOs
        // de auth y demás definen `message:` en español). Si sí, se
        // muestran esos -- son los que explican qué campo y por qué. Si
        // solo hay defaults en inglés, se cae a un texto genérico.
        const isSpanish = (m: string) =>
          /[áéíóúñ¿¡]|contrase|correo|obligatori|electrónic|caracteres|formato|válid|enlace|sesión|ingresá|ingresa/i.test(
            m,
          );
        const spanish = perField.filter(isSpanish);

        if (spanish.length === 0) {
          return new BadRequestException(
            'Revisa los datos ingresados: hay un campo incompleto o con un formato no válido.',
          );
        }

        // Siempre un string (no array): el front muestra `message` tal
        // cual. Si hay varios problemas se listan en líneas separadas.
        return new BadRequestException(spanish.join('\n'));
      },
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
