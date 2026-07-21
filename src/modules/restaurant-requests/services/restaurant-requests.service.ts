import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { CreateRestaurantRequestDto } from '../dto/create-restaurant-request.dto';

@Injectable()
export class RestaurantRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
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

  // 6. Subir logo a Cloudinary
  const logoUpload =
    await this.cloudinaryService.uploadImage(
      logo!,
      CloudinaryFolder.REQUESTS,
    );

  // Obtener URL del logo

  const logoUrl = logoUpload.secure_url;

// Subir cédula frontal
const cedulaFrontUpload =
  await this.cloudinaryService.uploadImage(
    cedulaFront!,
    CloudinaryFolder.REQUESTS,
  );

const cedulaFrontUrl = cedulaFrontUpload.secure_url;

// Subir cédula dorsal
const cedulaBackUpload =
  await this.cloudinaryService.uploadImage(
    cedulaBack!,
    CloudinaryFolder.REQUESTS,
  );

const cedulaBackUrl = cedulaBackUpload.secure_url;
  // Crear el objeto de redes sociales
  const socialNetworks = {
    facebook: dto.socialNetworks?.facebook ?? null,
    instagram: dto.socialNetworks?.instagram ?? null,
    tiktok: dto.socialNetworks?.tiktok ?? null,
    whatsapp: dto.socialNetworks?.whatsapp ?? null,
  };

  // Lo más importante: Crear la solicitud del restaurante
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
        estado: 'pendiente',
      },
    });

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