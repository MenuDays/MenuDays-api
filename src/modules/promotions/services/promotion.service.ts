import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
 * Crear una nueva promoción.
 *
 * Flujo:
 * 1. Buscar el restaurante del usuario autenticado.
 * 2. Validar que exista.
 * 3. Subir la imagen a Cloudinary.
 * 4. Crear la promoción en la base de datos.
 * 5. Retornar la promoción creada.
 */
async create(
  userId: bigint,
  createPromotionDto: CreatePromotionDto,
  file: Express.Multer.File,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Validar imagen
  if (!file) {
    throw new BadRequestException(
      'Debe seleccionar una imagen.',
    );
  }

  // Subir imagen a Cloudinary
  let imageUrl: string;

  try {
    const uploadedImage =
      await this.cloudinaryService.uploadImage(
        file,
        CloudinaryFolder.PROMOTIONS,
      );

    imageUrl = uploadedImage.secure_url;
  } catch {
    throw new InternalServerErrorException(
      'Error al subir la imagen a Cloudinary.',
    );
  }

  // Crear promoción
  const promotion =
    await this.prisma.promociones.create({
      data: {
        restaurante_id: restaurant.id,
        titulo: createPromotionDto.titulo,
        descripcion:
          createPromotionDto.descripcion,
        imagen_url: imageUrl,
        precio: createPromotionDto.precio,
        fecha_inicio: new Date(
          createPromotionDto.fechaInicio,
        ),
        fecha_fin: new Date(
          createPromotionDto.fechaFin,
        ),
        activa: true,
      },
    });

  return promotion;
}
 /**
 * Obtener todas las promociones
 * del restaurante autenticado.
 */
async findAll(userId: bigint) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Obtener promociones
  return await this.prisma.promociones.findMany({
    where: {
      restaurante_id: restaurant.id,
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

 /**
 * Obtener una promoción específica
 * verificando que pertenezca
 * al restaurante autenticado.
 */
async findOne(
  userId: bigint,
  promotionId: number,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar promoción
  const promotion =
    await this.prisma.promociones.findFirst({
      where: {
        id: BigInt(promotionId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!promotion) {
    throw new NotFoundException(
      'No se encontró la promoción.',
    );
  }

  return promotion;
}

  /**
 * Actualizar una promoción.
 *
 * Si llega una nueva imagen:
 * - eliminar la imagen anterior
 * - subir la nueva a Cloudinary
 * - actualizar la URL
 *
 * Si no llega imagen:
 * - mantener la existente.
 */
async update(
  userId: bigint,
  promotionId: number,
  updatePromotionDto: UpdatePromotionDto,
  file?: Express.Multer.File,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar promoción
  const promotion =
    await this.prisma.promociones.findFirst({
      where: {
        id: BigInt(promotionId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!promotion) {
    throw new NotFoundException(
      'No se encontró la promoción.',
    );
  }

  // Mantener imagen actual
  let imageUrl = promotion.imagen_url;

  // Si llega una nueva imagen
  if (file) {
    // Eliminar imagen anterior de Cloudinary
    if (promotion.imagen_url) {
      try {
        const publicId =
          this.cloudinaryService.extractPublicId(
            promotion.imagen_url,
          );

        await this.cloudinaryService.deleteImage(
          publicId,
        );
      } catch {
        // Si falla Cloudinary no impedimos
        // actualizar la promoción.
      }
    }

    // Subir nueva imagen
    try {
      const uploadedImage =
        await this.cloudinaryService.uploadImage(
          file,
          CloudinaryFolder.PROMOTIONS,
        );

      imageUrl = uploadedImage.secure_url;
    } catch {
      throw new InternalServerErrorException(
        'Error al subir la imagen a Cloudinary.',
      );
    }
  }

  // Actualizar promoción
  return await this.prisma.promociones.update({
    where: {
      id: promotion.id,
    },
    data: {
      titulo:
        updatePromotionDto.titulo ??
        promotion.titulo,

      descripcion:
        updatePromotionDto.descripcion ??
        promotion.descripcion,

      imagen_url: imageUrl,

      precio:
        updatePromotionDto.precio ??
        promotion.precio,

      fecha_inicio:
        updatePromotionDto.fechaInicio
          ? new Date(
              updatePromotionDto.fechaInicio,
            )
          : promotion.fecha_inicio,

      fecha_fin:
        updatePromotionDto.fechaFin
          ? new Date(
              updatePromotionDto.fechaFin,
            )
          : promotion.fecha_fin,

      updated_at: new Date(),
    },
  });
}
/**
 * Activar o desactivar
 * una promoción.
 *
 * Cambia el valor de
 * la propiedad "activa".
 */
async toggle(
  userId: bigint,
  promotionId: number,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar promoción
  const promotion =
    await this.prisma.promociones.findFirst({
      where: {
        id: BigInt(promotionId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!promotion) {
    throw new NotFoundException(
      'No se encontró la promoción.',
    );
  }

  // Cambiar estado
  const updatedPromotion =
    await this.prisma.promociones.update({
      where: {
        id: promotion.id,
      },
      data: {
        activa: !promotion.activa,
        updated_at: new Date(),
      },
    });

  return {
    message: updatedPromotion.activa
      ? 'Promoción activada correctamente.'
      : 'Promoción desactivada correctamente.',
    activa: updatedPromotion.activa,
  };
}

  /**
 * Eliminar una promoción.
 *
 * Se valida que la promoción
 * pertenezca al restaurante.
 *
 * Se elimina la imagen de
 * Cloudinary y luego se
 * elimina definitivamente
 * de la base de datos.
 */
async remove(
  userId: bigint,
  promotionId: number,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar promoción
  const promotion =
    await this.prisma.promociones.findFirst({
      where: {
        id: BigInt(promotionId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!promotion) {
    throw new NotFoundException(
      'No se encontró la promoción.',
    );
  }

  // Eliminar imagen de Cloudinary
  if (promotion.imagen_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          promotion.imagen_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla Cloudinary no impedimos
      // eliminar la promoción.
    }
  }

  // Eliminar definitivamente de la BD
  await this.prisma.promociones.delete({
    where: {
      id: promotion.id,
    },
  });

  return {
    message:
      'Promoción eliminada correctamente.',
  };
}
}
