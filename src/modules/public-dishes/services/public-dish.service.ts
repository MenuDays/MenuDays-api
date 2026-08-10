import { Injectable, NotFoundException } from '@nestjs/common';
import {
  estado_cuenta_rest,
  estado_disponibilidad,
} from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';
import { ExploreService } from '../../explore/services/explore.service';
import { FindPublicDishesDto } from '../dto/find-public-dishes.dto';

@Injectable()
export class PublicDishService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exploreService: ExploreService,
  ) {}

  /**
   * Devuelve sólo los platos disponibles de los mismos
   * restaurantes que devuelve Explore para los filtros recibidos.
   *
   * El filtro "search" se aplica sobre platos.nombre,
   * no sobre el nombre del restaurante.
   */
  async findAvailable(filters: FindPublicDishesDto) {
    // Explore se utiliza únicamente para los filtros de ubicación.
    // Se elimina "search" para evitar que Explore filtre por
    // restaurantes.nombre_comercial.
    const restaurants = await this.exploreService.findRestaurants({
      ...filters,
      search: undefined,
    });

    const restaurantIds = restaurants.map((restaurant) => restaurant.id);

    if (restaurantIds.length === 0) {
      return [];
    }

    const dishes = await this.prisma.platos.findMany({
      where: {
        restaurante_id: { in: restaurantIds },
        activo: true,
        estado: estado_disponibilidad.disponible,
        deleted_at: null,

        // Para platos públicos, "search" busca por el nombre del plato.
        ...(filters.search
          ? {
              nombre: {
                contains: filters.search,
                mode: 'insensitive',
              },
            }
          : {}),

        restaurantes: {
          deleted_at: null,
          estado_cuenta: estado_cuenta_rest.activo,
        },
      },
      include: {
        categorias: true,
        plato_imagenes: {
          orderBy: {
            orden: 'asc',
          },
        },
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            logo_url: true,
            estado_operativo: true,
            calificacion_promedio: true,
            cantidad_resenas: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const distancesByRestaurant = new Map(
      restaurants.map((restaurant) => [
        restaurant.id.toString(),
        restaurant.distancia,
      ]),
    );

    return dishes.map((dish) =>
      this.serializeDish(
        dish,
        distancesByRestaurant.get(dish.restaurante_id.toString()),
      ),
    );
  }

  /**
   * Un plato sólo es público mientras esté disponible,
   * activo y su restaurante permanezca activo.
   */
  async findOne(dishId: bigint) {
    const dish = await this.prisma.platos.findFirst({
      where: {
        id: dishId,
        activo: true,
        estado: estado_disponibilidad.disponible,
        deleted_at: null,
        restaurantes: {
          deleted_at: null,
          estado_cuenta: estado_cuenta_rest.activo,
        },
      },
      include: {
        categorias: true,
        plato_imagenes: {
          orderBy: {
            orden: 'asc',
          },
        },
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            descripcion: true,
            direccion: true,
            logo_url: true,
            portada_url: true,
            ubicacion_lat: true,
            ubicacion_lng: true,
            estado_operativo: true,
            calificacion_promedio: true,
            cantidad_resenas: true,
            ciudad: {
              select: {
                id: true,
                nombre: true,
                provincia: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
            restaurante_horarios: {
              orderBy: {
                dia_semana: 'asc',
              },
            },
          },
        },
      },
    });

    if (!dish) {
      throw new NotFoundException('Plato no encontrado.');
    }

    return this.serializeDish(dish);
  }

  /**
   * Serializa la respuesta pública del plato.
   *
   * Reemplaza la relación "restaurantes"
   * por "restaurante" y agrega la distancia
   * cuando corresponda.
   */
  private serializeDish<T extends { restaurantes: unknown }>(
    dish: T,
    distance?: number,
  ) {
    const { restaurantes, ...dishData } = dish;

    return {
      ...dishData,
      restaurante: restaurantes,
      ...(distance !== undefined ? { distancia: distance } : {}),
    };
  }
}