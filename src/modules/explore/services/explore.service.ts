import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { Prisma, estado_cuenta_rest } from '@prisma/client';

import { FindRestaurantsDto } from '../dto/find-restaurants.dto';
import { computeEstadoOperativo } from '../../../core/common/utils/restaurant-status.util';

@Injectable()
export class ExploreService {
  constructor(private readonly prisma: PrismaService) {}

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
  async findRestaurants(filters: FindRestaurantsDto) {
    // Construir filtros.
    const where = this.buildWhere(filters);

    // Obtener restaurantes.
    const restaurants = await this.prisma.restaurantes.findMany({
      where,
      include: {
        restaurante_horarios: true,
      },
    });

    // El estado operativo guardado es estático (nunca se actualiza solo);
    // se recalcula acá en base al horario real y la hora actual en Ecuador.
    const restaurantsWithStatus = restaurants.map((restaurant) => ({
      ...restaurant,
      estado_operativo: computeEstadoOperativo(
        restaurant.estado_operativo,
        restaurant.restaurante_horarios,
      ),
    }));

    // Aplicar el mismo criterio de radio usado por los consumidores
    // públicos cuando se recibe una ubicación de referencia.
    return this.filterByDistance(restaurantsWithStatus, filters);
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

  /**
   * Calcula la distancia geodésica con la fórmula de Haversine.
   * La base guarda las coordenadas de cada restaurante; el cliente
   * aporta la ubicación actual y, opcionalmente, su radio configurado.
   */
  private filterByDistance<
    T extends {
      ubicacion_lat: Prisma.Decimal;
      ubicacion_lng: Prisma.Decimal;
    },
  >(
    restaurants: T[],
    filters: FindRestaurantsDto,
  ): Array<T & { distancia?: number }> {
    const hasLatitude = filters.latitude !== undefined;
    const hasLongitude = filters.longitude !== undefined;

    if (hasLatitude !== hasLongitude) {
      throw new BadRequestException(
        'Debe enviar latitude y longitude para filtrar por distancia.',
      );
    }

    if (!hasLatitude || !hasLongitude) {
      return restaurants;
    }

    const radius = filters.radius ?? 5;

    return restaurants
      .map((restaurant) => ({
        ...restaurant,
        distancia: this.calculateDistanceInKm(
          filters.latitude!,
          filters.longitude!,
          Number(restaurant.ubicacion_lat),
          Number(restaurant.ubicacion_lng),
        ),
      }))
      .filter((restaurant) => restaurant.distancia <= radius)
      .sort((first, second) => first.distancia - second.distancia);
  }

  private calculateDistanceInKm(
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number,
  ) {
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const earthRadiusInKm = 6371;
    const latitudeDifference = toRadians(destinationLatitude - originLatitude);
    const longitudeDifference = toRadians(
      destinationLongitude - originLongitude,
    );

    const a =
      Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(originLatitude)) *
        Math.cos(toRadians(destinationLatitude)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const distance =
      2 * earthRadiusInKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Number(distance.toFixed(2));
  }
}
