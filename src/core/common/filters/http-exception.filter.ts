import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Traduce al español los mensajes de error que NestJS / sus pipes y
 * guards generan por defecto en inglés y que se le mostraban crudos al
 * usuario a través del front (services/api.ts usa `data.message`).
 *
 * Solo se tocan mensajes que coinciden con un patrón conocido del
 * framework -- cualquier mensaje propio de la app (ya en español) pasa
 * intacto. La estructura de la respuesta ({ statusCode, message, error })
 * no cambia, así que ningún contrato de endpoint se ve afectado.
 */
const TRANSLATIONS: { test: RegExp; message: string }[] = [
  {
    test: /^Unauthorized$/i,
    message: 'Tu sesión expiró. Inicia sesión nuevamente.',
  },
  {
    test: /^Forbidden( resource)?$/i,
    message: 'No tienes permiso para realizar esta acción.',
  },
  {
    // ParseIntPipe / ParseUUIDPipe / ParseBoolPipe, etc.
    test: /^Validation failed \(.*expected\)$/i,
    message: 'El identificador de la solicitud no es válido.',
  },
  {
    test: /^Cannot (GET|POST|PUT|PATCH|DELETE) /i,
    message: 'La dirección solicitada no existe.',
  },
  {
    test: /file too large/i,
    message: 'La imagen supera el tamaño máximo permitido.',
  },
  {
    test: /unexpected field/i,
    message: 'El archivo enviado no es válido.',
  },
  {
    test: /^Internal server error$/i,
    message:
      'Ocurrió un error en el servidor. Intenta de nuevo en unos minutos.',
  },
];

function translate(message: unknown): unknown {
  if (typeof message !== 'string') return message;
  for (const { test, message: es } of TRANSLATIONS) {
    if (test.test(message)) return es;
  }
  return message;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    let payload: Record<string, any>;
    if (typeof body === 'string') {
      payload = { statusCode: status, message: translate(body) };
    } else {
      const obj = body as Record<string, any>;
      payload = {
        ...obj,
        message: Array.isArray(obj.message)
          ? obj.message.map(translate)
          : translate(obj.message),
      };
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception.stack,
      );
    }

    response.status(status).json(payload);
  }
}
