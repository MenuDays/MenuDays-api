import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { RejectRestaurantRequestDto } from '../dto/reject-restaurant-request.dto';
import { Prisma, estado_solicitud } from '@prisma/client';

@Injectable()
export class RestaurantRequestsAdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}


/**
 * Obtener el listado de solicitudes de restaurantes.
 */
async getAllRequests(filters: {
  status?: string;
  restaurantName?: string;
  date?: string;
}) {
  // Construir filtros dinámicos
  const where: Prisma.solicitudes_restauranteWhereInput = {};

  // Filtrar por estado
  if (filters.status) {
    where.estado = filters.status as estado_solicitud;
  }

  // Filtrar por nombre del restaurante
  if (filters.restaurantName) {
    where.nombre_comercial = {
      contains: filters.restaurantName,
      mode: 'insensitive',
    };
  }

  // Filtrar por fecha de solicitud
  if (filters.date) {
    const startDate = new Date(filters.date);
    const endDate = new Date(filters.date);

    endDate.setDate(endDate.getDate() + 1);

    where.created_at = {
      gte: startDate,
      lt: endDate,
    };
  }

  // Consultar solicitudes
  const requests = await this.prisma.solicitudes_restaurante.findMany({
    where,
    include: {
      usuarios_solicitudes_restaurante_usuario_idTousuarios: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      provincia: {
        select: {
          id: true,
          nombre: true,
        },
      },
      ciudad: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  // Retornar listado
  return requests.map((request) => ({
  ...request,
  ubicacion_lat: Number(request.ubicacion_lat),
  ubicacion_lng: Number(request.ubicacion_lng),
  created_at: request.created_at.toISOString(),
  revisado_at: request.revisado_at
    ? request.revisado_at.toISOString()
    : null,
}));
}
/**
 * Obtener el detalle completo de una solicitud.
 */
async getRequestById(id: number) {
  // Buscar solicitud con toda la información relacionada
  const request = await this.prisma.solicitudes_restaurante.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      usuarios_solicitudes_restaurante_usuario_idTousuarios: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },

      provincia: {
        select: {
          id: true,
          nombre: true,
        },
      },

      ciudad: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });

  // Verificar existencia
  if (!request) {
    throw new NotFoundException(
      'La solicitud de restaurante no existe.',
    );
  }

  // Retornar información completa
return {
  ...request,
  ubicacion_lat: Number(request.ubicacion_lat),
  ubicacion_lng: Number(request.ubicacion_lng),
  created_at: request.created_at.toISOString(),
  revisado_at: request.revisado_at
    ? request.revisado_at.toISOString()
    : null,
};
}

  /**
 * Aprobar una solicitud de restaurante.
 */
async approveRequest(
  id: number,
  adminId: number,
) {
  // Buscar solicitud
  const request = await this.prisma.solicitudes_restaurante.findUnique({
    where: {
      id: BigInt(id),
    },
  });

  if (!request) {
    throw new NotFoundException(
      'La solicitud de restaurante no existe.',
    );
  }

  // Verificar estado
  if (request.estado !== 'pendiente') {
    throw new BadRequestException(
      'Solo se pueden aprobar solicitudes pendientes.',
    );
  }

  // Verificar que el usuario no tenga restaurante
  const restaurant = await this.prisma.restaurantes.findUnique({
    where: {
      usuario_id: request.usuario_id,
    },
  });

  if (restaurant) {
    throw new BadRequestException(
      'El usuario ya posee un restaurante registrado.',
    );
  }

  // TODO:
  // Crear restaurante
const createdRestaurant = await this.prisma.restaurantes.create({
  data: {
    usuario_id: request.usuario_id,
    solicitud_id: request.id,

    nombre_comercial: request.nombre_comercial,
    descripcion: request.descripcion,

    direccion: request.direccion,
    ciudad_id: request.ciudad_id,

    ubicacion_lat: request.ubicacion_lat,
    ubicacion_lng: request.ubicacion_lng,

    logo_url: request.logo_url,
    portada_url: null,
  },
});
  // Registrar teléfonos
  await this.prisma.restaurante_telefonos.create({
  data: {
    restaurante_id: createdRestaurant.id,
    telefono: request.telefono_contacto,
    tipo: 'ambos',
  },
});
  // Registrar redes sociales
  const socialNetworks = request.redes_sociales as Record<string, string>;

for (const [platform, url] of Object.entries(socialNetworks)) {
  if (!url) continue;

  if (
    platform === 'facebook' ||
    platform === 'instagram' ||
    platform === 'tiktok'
  ) {
    await this.prisma.restaurante_redes_sociales.create({
      data: {
        restaurante_id: createdRestaurant.id,
        plataforma: platform,
        url,
      },
    });
  } else {
    await this.prisma.restaurante_redes_sociales.create({
      data: {
        restaurante_id: createdRestaurant.id,
        plataforma: 'otro',
        url,
      },
    });
  }
}
  // Registrar horarios
  const schedules = request.horarios as any[];

for (const schedule of schedules) {
  await this.prisma.restaurante_horarios.create({
    data: {
      restaurante_id: createdRestaurant.id,
      dia_semana: schedule.day,
      hora_apertura: schedule.openingHour
        ? new Date(`1970-01-01T${schedule.openingHour}:00`)
        : null,
      hora_cierre: schedule.closingHour
        ? new Date(`1970-01-01T${schedule.closingHour}:00`)
        : null,
      cerrado: schedule.closed ?? false,
    },
  });
}

  // Cambiar rol del usuario
  await this.prisma.usuarios.update({
    where: {
      id: request.usuario_id,
    },
    data: {
      rol: 'restaurante', 
    },
  });

  await this.prisma.solicitudes_restaurante.update({
    where: {
      id: request.id,
    },
    data: {
      estado: 'aprobada',
      revisado_por: BigInt(adminId),
      revisado_at: new Date(),
    },
  });

  // TODO:
  // Registrar auditoría

  // TODO:
  // Crear notificación

  return {
    message: 'Solicitud aprobada correctamente.',
  };
}
  /**
 * Rechazar una solicitud de restaurante.
 */
async rejectRequest(
  id: number,
  adminId: number,
  dto: RejectRestaurantRequestDto,
) {
  // Buscar solicitud
  const request = await this.prisma.solicitudes_restaurante.findUnique({
    where: {
      id: BigInt(id),
    },
  });

  // Verificar existencia
  if (!request) {
    throw new NotFoundException(
      'La solicitud de restaurante no existe.',
    );
  }

  // Verificar estado pendiente
  if (request.estado !== 'pendiente') {
    throw new BadRequestException(
      'Solo se pueden rechazar solicitudes pendientes.',
    );
  }

  // Actualizar estado de la solicitud
  await this.prisma.solicitudes_restaurante.update({
    where: {
      id: request.id,
    },
    data: {
      estado: 'rechazada',
      motivo_rechazo: dto.rejectionReason,
      revisado_por: BigInt(adminId),
      revisado_at: new Date(),
    },
  });

  // TODO:
  // Registrar auditoría

  // TODO:
  // Crear notificación

  // Retornar éxito
  return {
    message: 'Solicitud rechazada correctamente.',
  };
}
}