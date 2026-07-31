import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
 * Agregar un restaurante a favoritos.
 *
 * Se valida que el restaurante exista.
 *
 * Se valida que el restaurante
 * no haya sido agregado previamente.
 *
 * Se registra el favorito.
 */
async addFavorite(
  userId: bigint,
  restaurantId: bigint,
) {

  // Buscar restaurante.

  await this.findRestaurant(restaurantId);

  // Validar si ya existe el favorito.

  const favorite = await this.findFavorite(
    userId,
    restaurantId,
  );

  if (favorite!) {
    throw new BadRequestException(
      'El restaurante ya se encuentra en favoritos.',
    );
  }

  // Registrar favorito.

  return this.prisma.favoritos.create({
    data: {
      usuario_id: userId,
      restaurante_id: restaurantId,
    },
  });

}
  /**
 * Obtener el listado de restaurantes favoritos
 * del usuario autenticado.
 *
 * Se devuelve la información pública
 * de cada restaurante favorito.
 */
async findAll(
  userId: bigint,
) {

  // Obtener favoritos del usuario.

  return this.prisma.favoritos.findMany({
    where: {
      usuario_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      restaurantes: {
        include: {
          ciudad: true,
          restaurante_categorias: {
            include: {
              categoria: {
                include: {
                  iconos: true,
                },
              },
            },
          },
        },
      },
    },
  });

}

  /**
 * Eliminar un restaurante de favoritos.
 *
 * Se valida que el favorito exista.
 *
 * Se elimina el registro.
 */
async remove(
  userId: bigint,
  restaurantId: bigint,
) {

  // Buscar favorito.

  const favorite = await this.findFavorite(
    userId,
    restaurantId,
  );

  if (!favorite!) {
    throw new NotFoundException(
      'El restaurante no se encuentra en favoritos.',
    );
  }

  // Eliminar favorito.

  await this.prisma.favoritos.delete({
    where: {
      id: favorite.id,
    },
  });

  // Retornar mensaje.

  return {
    message: 'Restaurante eliminado de favoritos correctamente.',
  };

}
  /**
 * Buscar un restaurante disponible.
 *
 * Se valida que exista y que
 * no se encuentre eliminado.
 */
private async findRestaurant(
  restaurantId: bigint,
) {

  // Buscar restaurante.

  const restaurant = await this.prisma.restaurantes.findFirst({
    where: {
      id: restaurantId,
      deleted_at: null,
      estado_cuenta: 'activo',
    },
  });

  // Validar restaurante.

  if (!restaurant) {
    throw new NotFoundException(
      'El restaurante no existe.',
    );
  }

  // Retornar restaurante.

  return restaurant;

}
  /**
 * Buscar un favorito del usuario.
 *
 * Se utiliza para evitar duplicados
 * y para validar eliminaciones.
 */
private async findFavorite(
  userId: bigint,
  restaurantId: bigint,
) {

  // Buscar favorito.

  return this.prisma.favoritos.findFirst({
    where: {
      usuario_id: userId,
      restaurante_id: restaurantId,
    },
  });

}
}