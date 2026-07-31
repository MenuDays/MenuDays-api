import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { Prisma, estado_cuenta_rest } from '@prisma/client';

import { FindRestaurantsDto } from '../dto/find-restaurants.dto';

@Injectable()
export class ExploreService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
 * Obtener el listado público de restaurantes.
 *
 * Se construyen los filtros de búsqueda.
 *
 * Se consultan los restaurantes
 * que cumplan dichos filtros.
 *
 * Finalmente se retorna el listado.
 */
async findRestaurants(
  filters: FindRestaurantsDto,
) {

  // Construir filtros.
  const where = this.buildWhere(filters);

  // Obtener restaurantes.
  const restaurants = await this.prisma.restaurantes.findMany({
    where,
  });

  // Retornar listado.
  return restaurants;
}
  /**
 * Construye dinámicamente el objeto
 * where de Prisma según los filtros
 * enviados por el cliente.
 */
private buildWhere(
  filters: FindRestaurantsDto,
): Prisma.restaurantesWhereInput {

  // Construir objeto where.
  const where: Prisma.restaurantesWhereInput = {
    deleted_at: null,
    estado_cuenta: estado_cuenta_rest.activo,
  };

  // Filtrar por nombre.
  if (filters.search) {
    where.nombre_comercial = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  // Filtrar por ciudad.
  if (filters.cityId) {
    where.ciudad_id = filters.cityId;
  }

  // Filtrar por provincia.
  if (filters.provinceId) {
    where.ciudad = {
      provincia_id: filters.provinceId,
    };
  }

  // Retornar filtros.
  return where;
}

}