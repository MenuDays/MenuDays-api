import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import { CreateReviewDto } from '../dto/create-review.dto';
import { ReplyReviewDto } from '../dto/reply-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

/**
 * Crear una reseña.
 *
 * Se valida que el pedido exista.
 *
 * Se valida que pertenezca al usuario.
 *
 * Se valida que el pedido
 * haya sido entregado.
 *
 * Se valida que el pedido
 * no tenga una reseña asociada.
 *
 * Se registra la reseña.
 *
 * Se actualiza la calificación
 * promedio del restaurante.
 */
async create(
  userId: bigint,
  createReviewDto: CreateReviewDto,
) {

  const {
    pedidoId,
    calificacion,
    comentario,
  } = createReviewDto;

  // Buscar pedido entregado.

  const order = await this.findDeliveredOrder(
    userId,
    BigInt(pedidoId),
  );

  // Validar que el pedido no tenga reseña.

  const existingReview = await this.prisma.resenas.findUnique({
    where: {
      pedido_id: BigInt(pedidoId),
    },
  });

  if (existingReview) {
    throw new BadRequestException(
      'El pedido ya posee una reseña.',
    );
  }

  // Buscar restaurante.

  await this.findRestaurant(
    order.restaurante_id,
  );

  // Registrar reseña.

  const review = await this.prisma.resenas.create({
    data: {
      usuario_id: userId,
      restaurante_id: order.restaurante_id,
      pedido_id: BigInt(pedidoId),
      calificacion,
      comentario,
    },
  });

  // Actualizar calificación del restaurante.

  await this.updateRestaurantRating(
    order.restaurante_id,
  );

  // Retornar reseña.

  return review;

}

  /**
 * Obtener las reseñas públicas
 * de un restaurante.
 *
 * Se valida que el restaurante exista.
 *
 * Se devuelve el listado
 * ordenado por fecha.
 */
async findRestaurantReviews(
  restaurantId: bigint,
) {

  // Buscar restaurante.

  await this.findRestaurant(
    restaurantId,
  );

  // Obtener reseñas.

  return this.prisma.resenas.findMany({
    where: {
      restaurante_id: restaurantId,
      estado: 'visible',
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      usuarios: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          foto_perfil_url: true,
        },
      },
    },
  });

}

  /**
 * Responder una reseña.
 *
 * Se valida que el usuario
 * sea propietario del restaurante.
 *
 * Se valida que la reseña exista.
 *
 * Se registra la respuesta.
 */
async reply(
  userId: bigint,
  reviewId: bigint,
  replyReviewDto: ReplyReviewDto,
) {

  const { respuesta } = replyReviewDto;

  // Buscar restaurante del usuario.

  const restaurant = await this.prisma.restaurantes.findFirst({
    where: {
      usuario_id: userId,
      deleted_at: null,
      estado_cuenta: 'activo',
    },
  });

  if (!restaurant) {
    throw new ForbiddenException(
      'No posee un restaurante asociado.',
    );
  }

  // Buscar reseña.

  const review = await this.findReview(
    reviewId,
  );

  // Validar que la reseña pertenezca al restaurante.

  if (review.restaurante_id !== restaurant.id) {
    throw new ForbiddenException(
      'No puede responder esta reseña.',
    );
  }

  // Validar que la reseña no haya sido respondida.

  if (review.respuesta_restaurante) {
    throw new BadRequestException(
      'La reseña ya fue respondida.',
    );
  }

  // Registrar respuesta.

  return this.prisma.resenas.update({
    where: {
      id: reviewId,
    },
    data: {
      respuesta_restaurante: respuesta,
      respuesta_at: new Date(),
    },
  });

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
 * Buscar una reseña.
 *
 * Se utiliza para validar
 * operaciones sobre la reseña.
 */
private async findReview(
  reviewId: bigint,
) {

  // Buscar reseña.

  const review = await this.prisma.resenas.findUnique({
    where: {
      id: reviewId,
    },
  });

  // Validar reseña.

  if (!review) {
    throw new NotFoundException(
      'La reseña no existe.',
    );
  }

  // Retornar reseña.

  return review;

}
  /**
 * Buscar un pedido entregado.
 *
 * Se valida que pertenezca
 * al usuario autenticado.
 *
 * Se valida que el pedido
 * haya sido entregado.
 */
private async findDeliveredOrder(
  userId: bigint,
  pedidoId: bigint,
) {

  // Buscar pedido.

  const order = await this.prisma.pedidos.findFirst({
    where: {
      id: pedidoId,
      usuario_id: userId,
      estado: 'entregado',
    },
  });

  // Validar pedido.

  if (!order) {
    throw new NotFoundException(
      'El pedido no existe o aún no fue entregado.',
    );
  }

  // Retornar pedido.

  return order;

}
  /**
 * Actualizar la calificación promedio
 * del restaurante.
 *
 * Se recalcula el promedio
 * y la cantidad de reseñas.
 */
private async updateRestaurantRating(
  restaurantId: bigint,
) {

  // Obtener estadísticas de las reseñas.

  const stats = await this.prisma.resenas.aggregate({
    where: {
      restaurante_id: restaurantId,
      estado: 'visible',
    },
    _avg: {
      calificacion: true,
    },
    _count: {
      id: true,
    },
  });

  // Actualizar restaurante.

  await this.prisma.restaurantes.update({
    where: {
      id: restaurantId,
    },
    data: {
      calificacion_promedio: stats._avg.calificacion ?? 0,
      cantidad_resenas: stats._count.id,
    },
  });

}
}