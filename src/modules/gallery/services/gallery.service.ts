import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

/**
 * Obtener el restaurante autenticado.
 *
 * Se utiliza en todos los métodos del módulo para verificar
 * que el usuario realmente posea un restaurante.
 */
private async getRestaurantByUser(
  userId: bigint,
) {
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
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
 * Obtener todas las imágenes de la galería
 * del restaurante autenticado.
 */
async getGallery(
  userId: bigint,
) {
  // Obtener restaurante autenticado
  const restaurant =
    await this.getRestaurantByUser(userId);

  // Obtener imágenes de la galería
  const images =
    await this.prisma.galeria_imagenes.findMany({
      where: {
        restaurante_id: restaurant.id,
      },
      orderBy: {
        orden: 'asc',
      },
    });

  // Retornar galería
  return images.map((image) => ({
    id: image.id,
    url: this.cloudinaryService.getOptimizedUrl(
      image.url,
    ),
    isCover: image.es_portada,
    order: image.orden,
    createdAt: image.created_at.toISOString(),
  }));
}

  /**
 * Subir una nueva imagen a la galería.
 *
 * Flujo:
 * 1. Obtener restaurante.
 * 2. Subir imagen a Cloudinary.
 * 3. Obtener el último orden.
 * 4. Crear registro en la base.
 * 5. Si es la primera imagen,
 *    convertirla en portada.
 */
async uploadImage(
  userId: bigint,
  file: Express.Multer.File,
) {
  // Obtener restaurante autenticado
  const restaurant =
    await this.getRestaurantByUser(userId);

  // Subir imagen a Cloudinary
  const upload =
    await this.cloudinaryService.uploadImage(
      file,
      CloudinaryFolder.RESTAURANTS,
    );

  // Obtener el último orden registrado
  const lastImage =
    await this.prisma.galeria_imagenes.findFirst({
      where: {
        restaurante_id: restaurant.id,
      },
      orderBy: {
        orden: 'desc',
      },
    });

  // Calcular el nuevo orden
  const nextOrder = lastImage
    ? lastImage.orden + 1
    : 1;

  // Verificar si será la primera imagen
  const totalImages =
    await this.prisma.galeria_imagenes.count({
      where: {
        restaurante_id: restaurant.id,
      },
    });

  // Registrar imagen
  const image =
    await this.prisma.galeria_imagenes.create({
      data: {
        restaurante_id: restaurant.id,
        url: upload.secure_url,
        orden: nextOrder,
        es_portada: totalImages === 0,
      },
    });

  // Retornar imagen creada
  return {
    id: image.id,
    url: this.cloudinaryService.getOptimizedUrl(
      image.url,
    ),
    isCover: image.es_portada,
    order: image.orden,
    createdAt: image.created_at.toISOString(),
  };
}

  /**
 * Eliminar una imagen de la galería.
 *
 * Flujo:
 * 1. Obtener restaurante.
 * 2. Buscar imagen.
 * 3. Verificar pertenencia.
 * 4. Eliminar en Cloudinary.
 * 5. Eliminar en la base.
 * 6. Si era portada,
 *    seleccionar otra automáticamente.
 */
async deleteImage(
  userId: bigint,
  imageId: number,
) {
  // Obtener restaurante autenticado
  const restaurant =
    await this.getRestaurantByUser(userId);

  // Buscar imagen
  const image =
    await this.prisma.galeria_imagenes.findUnique({
      where: {
        id: BigInt(imageId),
      },
    });

  // Verificar existencia
  if (!image) {
    throw new NotFoundException(
      'La imagen no existe.',
    );
  }

  // Verificar pertenencia
  if (image.restaurante_id !== restaurant.id) {
    throw new BadRequestException(
      'La imagen no pertenece al restaurante.',
    );
  }

  // Eliminar imagen de Cloudinary
  const publicId =
    this.cloudinaryService.extractPublicId(
      image.url,
    );

  await this.cloudinaryService.deleteImage(
    publicId,
  );

  // Eliminar imagen de la base
  await this.prisma.galeria_imagenes.delete({
    where: {
      id: image.id,
    },
  });

  // Si era la portada, seleccionar otra automáticamente
  if (image.es_portada) {
    const nextCover =
      await this.prisma.galeria_imagenes.findFirst({
        where: {
          restaurante_id: restaurant.id,
        },
        orderBy: {
          orden: 'asc',
        },
      });

    if (nextCover) {
      await this.prisma.galeria_imagenes.update({
        where: {
          id: nextCover.id,
        },
        data: {
          es_portada: true,
        },
      });
    }
  }

  return {
    message: 'Imagen eliminada correctamente.',
  };
}
  /**
 * Establecer una imagen como portada.
 *
 * Flujo:
 * 1. Obtener restaurante.
 * 2. Buscar imagen.
 * 3. Verificar pertenencia.
 * 4. Quitar portada anterior.
 * 5. Asignar nueva portada.
 */
async setCoverImage(
  userId: bigint,
  imageId: number,
) {
  // Obtener restaurante autenticado
  const restaurant =
    await this.getRestaurantByUser(userId);

  // Buscar imagen
  const image =
    await this.prisma.galeria_imagenes.findUnique({
      where: {
        id: BigInt(imageId),
      },
    });

  // Verificar existencia
  if (!image) {
    throw new NotFoundException(
      'La imagen no existe.',
    );
  }

  // Verificar pertenencia
  if (image.restaurante_id !== restaurant.id) {
    throw new BadRequestException(
      'La imagen no pertenece al restaurante.',
    );
  }

  // Actualizar portada
  await this.prisma.$transaction([
    this.prisma.galeria_imagenes.updateMany({
      where: {
        restaurante_id: restaurant.id,
        es_portada: true,
      },
      data: {
        es_portada: false,
      },
    }),

    this.prisma.galeria_imagenes.update({
      where: {
        id: image.id,
      },
      data: {
        es_portada: true,
      },
    }),
  ]);

  return {
    message: 'Imagen de portada actualizada correctamente.',
  };
}
}