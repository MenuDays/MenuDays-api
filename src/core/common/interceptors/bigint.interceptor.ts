import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => this.convertBigInt(data)),
    );
  }

  private convertBigInt(value: any): any {
  // BigInt -> string
  if (typeof value === 'bigint') {
    return value.toString();
  }

  // Prisma Decimal -> number
  if (value instanceof Decimal) {
    return value.toNumber();
  }

  // Date -> dejar que Nest lo serialice
  if (value instanceof Date) {
    return value;
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map((item) =>
      this.convertBigInt(item),
    );
  }

  // Objetos
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        this.convertBigInt(val),
      ]),
    );
  }

  return value;
}
}