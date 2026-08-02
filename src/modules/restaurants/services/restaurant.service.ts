import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { UpdateRestaurantCategoriesDto } from '../dto/update-restaurant-categories.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  //función para obtener perfil de restaurant
async getProfile(userId: bigint) {
  // Buscar el restaurante asociado al usuario autenticado.
  await this.findRestaurantByUserId(userId);

  // Obtener toda la información relacionada del restaurante.
  const restaurant = await this.prisma.restaurantes.findUnique({
    where: {
      usuario_id: BigInt(userId),
    },
    include: {
      ciudad: {
        include: {
          provincia: true,
        },
      },
      restaurante_telefonos: true,
      restaurante_redes_sociales: true,
      restaurante_horarios: {
        orderBy: {
          dia_semana: 'asc',
        },
      },
    },
  });

  if (!restaurant) {
    return null;
  }

  return {
    ...restaurant,
    ubicacion_lat:
      restaurant.ubicacion_lat?.toNumber() ?? null,
    ubicacion_lng:
      restaurant.ubicacion_lng?.toNumber() ?? null,
    calificacion_promedio:
      restaurant.calificacion_promedio?.toNumber() ?? null,

    ciudad: restaurant.ciudad
      ? {
          ...restaurant.ciudad,
          latitud:
            restaurant.ciudad.latitud?.toNumber() ??
            null,
          longitud:
            restaurant.ciudad.longitud?.toNumber() ??
            null,
        }
      : null,
  };
}

//funcion de modificar perfil
async updateProfile(
  userId: bigint,
  updateRestaurantDto: UpdateRestaurantDto,
) {
  // Verificar que el restaurante exista.
  const restaurant = await this.findRestaurantByUserId(
    userId,
  );

  // TODO:
  // Validar que la ciudad exista en la base de datos
  // antes de actualizar el restaurante.

  // Actualizar la información del restaurante.
  await this.prisma.restaurantes.update({
    where: {
      id: restaurant.id,
    },
    data: {
      nombre_comercial:
        updateRestaurantDto.nombreComercial,
      descripcion:
        updateRestaurantDto.descripcion,
      direccion:
        updateRestaurantDto.direccion,
      ciudad_id:
        updateRestaurantDto.ciudadId,
      ubicacion_lat:
        updateRestaurantDto.ubicacionLat,
      ubicacion_lng:
        updateRestaurantDto.ubicacionLng,
      logo_url:
        updateRestaurantDto.logoUrl,
      portada_url:
        updateRestaurantDto.portadaUrl,
    },
  });

  // Retornar el perfil actualizado.
  return this.getProfile(userId);
}
  private async findRestaurantByUserId(
  userId: bigint,
) {
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: BigInt(userId),
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró un restaurante asociado al usuario.',
    );
  }

  return restaurant;
}
/**
 * Obtener las categorías seleccionadas por el restaurante.
 *
 * Se valida que el usuario tenga
 * un restaurante asociado.
 *
 * Se retornan las categorías con
 * la información de su ícono.
 */
async getCategories(userId: bigint) {
  // Buscar restaurante.
  const restaurant =
    await this.findRestaurantByUserId(userId);

  // Obtener las categorías seleccionadas.
  const restaurantCategories =
    await this.prisma.restaurante_categoria.findMany({
      where: {
        restaurante_id: restaurant.id,
      },
      include: {
        categoria: {
          include: {
            iconos: true,
          },
        },
      },
      orderBy: {
        categoria_id: 'asc',
      },
    });

  // Retornar las categorías.
  return restaurantCategories.map(
    (restaurantCategory) =>
      restaurantCategory.categoria,
  );
}
/**
 * Reemplazar las categorías seleccionadas por el restaurante.
 *
 * Se validan las categorías recibidas y
 * se reemplazan todas las relaciones existentes.
 *
 * Se retorna el listado actualizado.
 */
async replaceCategories(
  userId: bigint,
  updateRestaurantCategoriesDto: UpdateRestaurantCategoriesDto,
) {
  // Buscar restaurante.
  const restaurant =
    await this.findRestaurantByUserId(userId);

  const { categoryIds } =
    updateRestaurantCategoriesDto;

  // Verificar que todas las categorías existan.
  const categories =
    await this.prisma.categorias.findMany({
      where: {
        id: {
          in: categoryIds.map((id) => BigInt(id)),
        },
      },
    });

  if (categories.length !== categoryIds.length) {
    throw new NotFoundException(
      'Una o más categorías no existen.',
    );
  }

  // Reemplazar las categorías del restaurante.
  await this.prisma.$transaction(async (tx) => {
    // Eliminar relaciones existentes.
    await tx.restaurante_categoria.deleteMany({
      where: {
        restaurante_id: restaurant.id,
      },
    });

    // Crear nuevas relaciones.
    await tx.restaurante_categoria.createMany({
      data: categoryIds.map((categoryId) => ({
        restaurante_id: restaurant.id,
        categoria_id: BigInt(categoryId),
      })),
    });
  });

  // Retornar categorías actualizadas.
  return this.getCategories(userId);
}
}