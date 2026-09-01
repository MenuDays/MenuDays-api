import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';
import { NotificationsService } from '../../notifications/services/notifications.service';

import { CreateRestaurantRequestDto } from '../dto/create-restaurant-request.dto';

@Injectable()
export class RestaurantRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationsService,
  ) {}


  /**
 * Crear una nueva solicitud para registrar un restaurante.
 */
async createRequest(
  userId: number,
  dto: CreateRestaurantRequestDto,
  logo?: Express.Multer.File,
  cedulaFront?: Express.Multer.File,
  cedulaBack?: Express.Multer.File,
) {

  
  // Verificar que el usuario exista
  const user = await this.prisma.usuarios.findUnique({
    where: {
      id: BigInt(userId),
    },
  });

  if (!user) {
    throw new NotFoundException('El usuario no existe.');
  }

  //Verificar que el usuario no tenga una solicitud pendiente
  const existingRequest =
    await this.prisma.solicitudes_restaurante.findFirst({
      where: {
        usuario_id: BigInt(userId),
        estado: 'pendiente',
      },
    });

  if (existingRequest) {
    throw new BadRequestException(
      'Ya posee una solicitud pendiente.',
    );
  }

  // Validar que la provincia exista
  const province = await this.prisma.provincias.findUnique({
    where: {
      id: BigInt(dto.provinceId),
    },
  });

  if (!province) {
    throw new NotFoundException(
      'La provincia seleccionada no existe.',
    );
  }

  // Validar que la ciudad exista
  const city = await this.prisma.ciudades.findUnique({
    where: {
      id: BigInt(dto.cityId),
    },
  });

  if (!city) {
    throw new NotFoundException(
      'La ciudad seleccionada no existe.',
    );
  }
  // Verificar que la ciudad pertenezca a la provincia

  if (city.provincia_id !== BigInt(dto.provinceId)) {
    throw new BadRequestException(
      'La ciudad no pertenece a la provincia seleccionada.',
    );
  }

  // Las 3 imágenes son obligatorias. Si alguna no llegó (o llegó vacía
  // porque su URI local ya no era válida) se corta acá con un mensaje
  // claro, ANTES de subir nada -- así el usuario sabe qué foto volver a
  // cargar y no queda una solicitud a medias.
  if (!logo?.buffer?.length) {
    throw new BadRequestException(
      'Falta el logo del restaurante o la imagen no se pudo leer. Volvé a subirla.',
    );
  }
  if (!cedulaFront?.buffer?.length || !cedulaBack?.buffer?.length) {
    throw new BadRequestException(
      'Falta alguna foto de la cédula o no se pudo leer. Volvé a subir el frente y el dorso.',
    );
  }

  // Subida de las 3 imágenes a Cloudinary. Si falla alguna, se devuelve
  // un error entendible en vez de un 500 crudo -- la solicitud todavía
  // no se creó, así que el usuario puede reintentar sin duplicar nada
  // (el chequeo de "solicitud pendiente" de arriba lo cubre).
  let logoUrl: string;
  let cedulaFrontUrl: string;
  let cedulaBackUrl: string;
  try {
    const [logoUpload, cedulaFrontUpload, cedulaBackUpload] = await Promise.all([
      this.cloudinaryService.uploadImage(logo, CloudinaryFolder.REQUESTS),
      this.cloudinaryService.uploadImage(cedulaFront, CloudinaryFolder.REQUESTS),
      this.cloudinaryService.uploadImage(cedulaBack, CloudinaryFolder.REQUESTS),
    ]);
    logoUrl = logoUpload.secure_url;
    cedulaFrontUrl = cedulaFrontUpload.secure_url;
    cedulaBackUrl = cedulaBackUpload.secure_url;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException(
      'No se pudieron subir las imágenes. Revisá tu conexión y volvé a intentarlo en unos segundos.',
    );
  }
  // Crear el objeto de redes sociales
  const socialNetworks = {
    facebook: dto.socialNetworks?.facebook ?? null,
    instagram: dto.socialNetworks?.instagram ?? null,
    tiktok: dto.socialNetworks?.tiktok ?? null,
    whatsapp: dto.socialNetworks?.whatsapp ?? null,
  };
    // Crear el objeto de horarios
const schedules = (dto.schedules ?? []).map(schedule => ({
  day: schedule.day,
  openingHour: schedule.openingHour,
  closingHour: schedule.closingHour,
  closed: schedule.closed,
}));  // Lo más importante: Crear la solicitud del restaurante
  const request =
  await this.prisma.solicitudes_restaurante.create({
    data: {
      usuario_id: BigInt(userId),
      nombre_comercial: dto.commercialName,
      descripcion: dto.description,
      direccion: dto.address,
      provincia_id: BigInt(dto.provinceId),
      ciudad_id: BigInt(dto.cityId),
      ubicacion_lat: dto.latitude,
      ubicacion_lng: dto.longitude,
      telefono_contacto: dto.contactPhone,

      logo_url: logoUrl,
      cedula_frontal_url: cedulaFrontUrl,
      cedula_dorsal_url: cedulaBackUrl,

      redes_sociales: socialNetworks,
      horarios: schedules, // <-- AGREGAR ESTA LÍNEA

      estado: 'pendiente',
    },
  });

  // Avisar a los administradores que hay una solicitud nueva para
  // revisar. Si falla (ej. no hay admins cargados todavía), no debe
  // tumbar la creación de la solicitud -- se registra y se sigue.
  await this.notifyAdminsOfNewRequest(request.id, dto.commercialName);

  // Retornar respuesta
  return {
    success: true,
    message: 'Solicitud enviada correctamente.',
    data: {
      id: request.id,
      estado: request.estado,
    },
  };
}

  /**
 * Crea una notificación para cada usuario con rol administrador,
 * avisando que llegó una solicitud de restaurante nueva para revisar.
 */
private async notifyAdminsOfNewRequest(
  requestId: bigint,
  commercialName: string,
) {

  try {
    const admins = await this.prisma.usuarios.findMany({
      where: {
        rol: 'administrador',
        estado: 'activo',
      },
      select: {
        id: true,
      },
    });

    if (admins.length === 0) {
      return;
    }

    await this.prisma.notificaciones.createMany({
      data: admins.map((admin) => ({
        usuario_id: admin.id,
        tipo: 'solicitud_nueva' as const,
        titulo: 'Nueva solicitud de restaurante',
        mensaje: `"${commercialName}" solicitó registrarse como restaurante y está esperando revisión.`,
        referencia_tipo: 'solicitud_restaurante',
        referencia_id: requestId,
      })),
    });
  } catch (error) {
    console.error(
      'No se pudieron crear las notificaciones de nueva solicitud:',
      error,
    );
  }

}
  /**
 * Consultar el estado de la solicitud del usuario.
 */
async getRequestStatus(userId: number) {
  // Buscar la solicitud del usuario
  const request =
    await this.prisma.solicitudes_restaurante.findFirst({
      where: {
        usuario_id: BigInt(userId),
      },
      orderBy: {
        created_at: 'desc',
      },
    });

  // Verificar que exista
  if (!request) {
    throw new NotFoundException(
      'No se encontró ninguna solicitud registrada.',
    );
  }
  // Retornar el estado actual
  return {
    id: request.id,
    restaurantName: request.nombre_comercial,
    status: request.estado,
    requestDate: request.created_at,
    adminObservations: request.motivo_rechazo,
  };
}
}