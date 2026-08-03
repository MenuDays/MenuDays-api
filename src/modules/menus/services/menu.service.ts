import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
  userId: bigint,
  createMenuDto: CreateMenuDto,
  file: Express.Multer.File,
) {
  // Buscar el restaurante del usuario autenticado
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

  // Validar que se haya enviado una imagen
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
        CloudinaryFolder.MENUS,
      );

    imageUrl = uploadedImage.secure_url;
  } catch {
    throw new InternalServerErrorException(
      'Error al subir la imagen a Cloudinary.',
    );
  }

  // Crear menú
  const menu =
    await this.prisma.menus_del_dia.create({
      data: {
        restaurante_id: restaurant.id,

        nombre: createMenuDto.nombre,

        descripcion:
          createMenuDto.descripcion,

        precio: createMenuDto.precio,

        foto_url: imageUrl,

        estado:
  createMenuDto.estado ??
  'programado',

        fecha_inicio: new Date(
          createMenuDto.fechaInicio,
        ),

        fecha_fin: new Date(
          createMenuDto.fechaFin,
        ),
      },
    });

  return this.serializeMenu(menu);
}

/**
 * Obtener todos los menús
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

  // Obtener menús
  const menus = await this.prisma.menus_del_dia.findMany({
  where: {
    restaurante_id: restaurant.id,
    deleted_at: null,
  },
  orderBy: {
    created_at: 'desc',
  },
});

return menus.map((menu) => this.serializeMenu(menu));
}
  /**
 * Obtener un menú específico
 * verificando que pertenezca
 * al restaurante autenticado.
 */
async findOne(
  userId: bigint,
  menuId: number,
) {
  // Buscar restaurante del usuario autenticado
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

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  return this.serializeMenu(menu);
}

  /**
 * Actualizar un menú.
 *
 * Si llega una nueva imagen:
 * - subirla a Cloudinary
 * - reemplazar la URL anterior
 *
 * Si no llega imagen:
 * - mantener la existente.
 */
async update(
  userId: bigint,
  menuId: number,
  updateMenuDto: UpdateMenuDto,
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

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Mantener imagen actual por defecto
  let imageUrl = menu.foto_url;

  // Si llega una nueva imagen
  if (file) {
    try {
      // Eliminar imagen anterior
      if (menu.foto_url) {
        const publicId =
          this.cloudinaryService.extractPublicId(
            menu.foto_url,
          );

        await this.cloudinaryService.deleteImage(
          publicId,
        );
      }

      // Subir nueva imagen
      const uploadedImage =
        await this.cloudinaryService.uploadImage(
          file,
          CloudinaryFolder.MENUS,
        );

      imageUrl = uploadedImage.secure_url;
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar la imagen del menú.',
      );
    }
  }

  // Actualizar menú
  const updatedMenu =
  await this.prisma.menus_del_dia.update({
    where: {
      id: menu.id,
    },
    data: {
      nombre:
        updateMenuDto.nombre ?? menu.nombre,

      descripcion:
        updateMenuDto.descripcion ??
        menu.descripcion,

      precio:
        updateMenuDto.precio ?? menu.precio,

      foto_url: imageUrl,

      estado:
  updateMenuDto.estado ??
  menu.estado,
      fecha_inicio: updateMenuDto.fechaInicio
        ? new Date(updateMenuDto.fechaInicio)
        : menu.fecha_inicio,

      fecha_fin: updateMenuDto.fechaFin
        ? new Date(updateMenuDto.fechaFin)
        : menu.fecha_fin,

      updated_at: new Date(),
    },
  });

return this.serializeMenu(updatedMenu);
}

 /**
 * Eliminar un menú.
 *
 * Se valida que el menú
 * pertenezca al restaurante.
 *
 * Se elimina la imagen de
 * Cloudinary y luego el
 * registro de la base de datos.
 */
async remove(
  userId: bigint,
  menuId: number,
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

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Eliminar imagen de Cloudinary
  if (menu.foto_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          menu.foto_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla Cloudinary no impedimos
      // eliminar el registro de la BD.
    }
  }

  // Eliminar de la base de datos
  await this.prisma.menus_del_dia.delete({
    where: {
      id: menu.id,
    },
  });

  return {
    message:
      'Menú eliminado correctamente.',
  };
}
private serializeMenu(menu: any) {
  return {
    ...menu,
    precio: menu.precio?.toNumber() ?? null,
  };
}
/**
 * Publicar u ocultar
 * un menú del día.
 */
async toggle(
  userId: bigint,
  menuId: number,
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

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Alternar estado
  const nuevoEstado =
    menu.estado === 'publicado'
      ? 'oculto'
      : 'publicado';

  const updatedMenu =
    await this.prisma.menus_del_dia.update({
      where: {
        id: menu.id,
      },
      data: {
        estado: nuevoEstado,
        updated_at: new Date(),
      },
    });

  return {
    message:
      updatedMenu.estado === 'publicado'
        ? 'Menú publicado correctamente.'
        : 'Menú ocultado correctamente.',
    estado: updatedMenu.estado,
  };
}
}