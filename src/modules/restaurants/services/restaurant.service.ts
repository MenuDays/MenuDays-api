import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  //función para obtener perfil de restaurant
 async getProfile(userId: bigint) {
  // Buscar el restaurante asociado al usuario autenticado.
  const restaurant = await this.findRestaurantByUserId(
    userId,
  );

  // Obtener toda la información relacionada del restaurante.
  return this.prisma.restaurantes.findUnique({
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
}