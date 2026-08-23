import {
  Injectable,
} from '@nestjs/common';

import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ============================================================
  // PERFIL
  // ============================================================

 //Función getProfile()
  async getProfile(userId: number) {
  await this.validateUser(userId);

  const user = await this.prisma.usuarios.findUnique({
    where: {
      id: userId,
    },
    include: {
      ciudad: {
        select: {
          id: true,
          nombre: true,
          provincia: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
      // Una cuenta de restaurante no suele completar su ubicación/
      // teléfono PERSONAL (eso vive en `restaurantes`, no en
      // `usuarios`) -- se incluye acá para poder usarlo como fallback
      // en buildProfileResponse cuando el usuario entra a "Ver como
      // comensal" y esos campos personales están vacíos.
      restaurantes: {
        select: {
          ubicacion_lat: true,
          ubicacion_lng: true,
          ciudad: {
            select: {
              id: true,
              nombre: true,
              provincia: { select: { id: true, nombre: true } },
            },
          },
          restaurante_telefonos: {
            select: { telefono: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado.');
  }

  return this.buildProfileResponse(user);
}
//Función updateProfile()
  async updateProfile(
  userId: number,
  updateProfileDto: UpdateProfileDto,
) {
  const {
  firstName,
  lastName,
  phoneNumber,
  provinceId,
  cityId,
  latitude,
  longitude,
} = updateProfileDto;

  await this.validateUser(userId);

  // Solo validar ubicación si se envía
  if (provinceId !== undefined) {
    await this.validateProvince(provinceId);
  }

  if (cityId !== undefined) {
    await this.validateCity(cityId);
  }

  if (provinceId !== undefined && cityId !== undefined) {
    await this.validateCityBelongsToProvince(
      cityId,
      provinceId,
    );
  }

  let normalizedPhone: string | undefined;

  if (phoneNumber) {
    normalizedPhone = this.normalizePhone(phoneNumber);
    await this.validatePhoneNumber(
      normalizedPhone,
      userId,
    );
  }

  const updatedUser = await this.prisma.usuarios.update({
    where: {
      id: userId,
    },
    data: {
      ...(firstName !== undefined && {
        nombre: firstName,
      }),
      ...(lastName !== undefined && {
        apellido: lastName,
      }),
      ...(cityId !== undefined && {
        ciudad_id: cityId,
      }),
      ...(normalizedPhone !== undefined && {
        phoneNumber: normalizedPhone,
      }),
      ...(latitude !== undefined && {
        ubicacion_lat: latitude,
      }),
      ...(longitude !== undefined && {
        ubicacion_lng: longitude,
      }),
    },
    include: {
      ciudad: {
        select: {
          id: true,
          nombre: true,
          provincia: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
    },
  });

  return this.buildProfileResponse(updatedUser);
}

//Función de updatePhoto()
  async updatePhoto(
  userId: number,
  file: Express.Multer.File,
) {
  // Validar usuario
  const user = await this.validateUser(userId);

  // Subir nueva imagen a Cloudinary
  const uploadedImage =
    await this.cloudinaryService.uploadImage(
      file,
      CloudinaryFolder.USERS,
    );

  // Actualizar fotografía en la base de datos
  await this.prisma.usuarios.update({
    where: {
      id: userId,
    },
    data: {
      foto_perfil_url: uploadedImage.secure_url,
    },
  });

  // Eliminar la imagen anterior de Cloudinary
  if (user.foto_perfil_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          user.foto_perfil_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si ocurre un error al eliminar la imagen anterior,
      // no se interrumpe la actualización del perfil.
    }
  }

  return {
    photoUrl: uploadedImage.secure_url,
    message: 'Fotografía actualizada correctamente.',
  };
}

//Función de modificar contraseña
  async changePassword(
  userId: number,
  updatePasswordDto: UpdatePasswordDto,
) {
  const { currentPassword, newPassword } =
    updatePasswordDto;

  if (currentPassword === newPassword) {
    throw new BadRequestException(
      'La nueva contraseña debe ser diferente a la actual.',
    );
  }

  await this.validateCurrentPassword(
    userId,
    currentPassword,
  );

  const hashedPassword = await this.hashPassword(
    newPassword,
  );

  await this.prisma.usuarios.update({
    where: {
      id: userId,
    },
    data: {
      password_hash: hashedPassword,
    },
  });

  return {
    message: 'Contraseña actualizada correctamente.',
  };
}
async deletePhoto(userId: number) {
  // Validar usuario
  const user = await this.validateUser(userId);

  // Verificar que exista una fotografía
  if (!user.foto_perfil_url) {
    throw new BadRequestException(
      'El usuario no posee una fotografía de perfil.',
    );
  }

  // Eliminar imagen de Cloudinary
  const publicId =
    this.cloudinaryService.extractPublicId(
      user.foto_perfil_url,
    );

  await this.cloudinaryService.deleteImage(publicId);

  // Eliminar referencia en la base de datos
  await this.prisma.usuarios.update({
    where: {
      id: userId,
    },
    data: {
      foto_perfil_url: null,
    },
  });

  return {
    message: 'Fotografía eliminada correctamente.',
  };
}

  //para retornar el perfil en formato objeto con ru rta
private buildProfileResponse(user: any) {
  // Una cuenta de restaurante casi nunca completa su ubicación/
  // teléfono/ciudad PERSONAL (son campos de `usuarios`, distintos de
  // los de `restaurantes` que sí carga al registrarse) -- así que sin
  // esto, "Ver como comensal" mostraba el perfil vacío/roto para
  // cualquier cuenta de restaurante. Si el dato personal falta y la
  // cuenta tiene un restaurante vinculado, se usa el del restaurante
  // como fallback -- `usingRestaurantInfo` le avisa al front que ese
  // valor no es "suyo" como comensal sino heredado de su restaurante.
  const restaurant = user.restaurantes;
  const hasOwnLocation = user.ubicacion_lat != null && user.ubicacion_lng != null;
  const hasOwnPhone = !!user.phoneNumber;
  const hasOwnCity = !!user.ciudad;

  const latitude = hasOwnLocation
    ? user.ubicacion_lat.toNumber()
    : (restaurant?.ubicacion_lat?.toNumber() ?? null);
  const longitude = hasOwnLocation
    ? user.ubicacion_lng.toNumber()
    : (restaurant?.ubicacion_lng?.toNumber() ?? null);
  const phoneNumber = hasOwnPhone
    ? user.phoneNumber
    : (restaurant?.restaurante_telefonos?.[0]?.telefono ?? null);
  const ciudadSource = hasOwnCity ? user.ciudad : restaurant?.ciudad;

  return {
    id: user.id,
    firstName: user.nombre,
    lastName: user.apellido,
    email: user.email,
    phoneNumber,
    profilePhotoUrl: user.foto_perfil_url,

    province: ciudadSource?.provincia
      ? {
          id: ciudadSource.provincia.id,
          name: ciudadSource.provincia.nombre,
        }
      : null,

    city: ciudadSource
      ? {
          id: ciudadSource.id,
          name: ciudadSource.nombre,
        }
      : null,

    status: user.estado,
    emailVerified: user.email_verificado,
    createdAt: user.created_at,
    latitude,
    longitude,
    radioBusquedaKm: user.radio_busqueda_km.toNumber(),
    // true si location/telefono/ciudad de arriba vinieron del
    // restaurante vinculado en vez del propio usuario -- el front lo
    // usa para aclarar "esto es la info de tu restaurante" en vez de
    // mostrarlo como si fuera un dato personal cualquiera.
    usingRestaurantInfo: !!restaurant && (!hasOwnLocation || !hasOwnPhone || !hasOwnCity),
  };
}

  // ============================================================
// VALIDACIONES
// ============================================================

private async validateUser(userId: number) {
  const user = await this.prisma.usuarios.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado.');
  }

  return user;
}

private async validateProvince(provinceId: number) {
  const province = await this.prisma.provincias.findUnique({
    where: { id: provinceId },
  });

  if (!province) {
    throw new NotFoundException('Provincia no encontrada.');
  }

  return province;
}

private async validateCity(cityId: number) {
  const city = await this.prisma.ciudades.findUnique({
    where: { id: cityId },
  });

  if (!city) {
    throw new NotFoundException('Ciudad no encontrada.');
  }

  return city;
}

private async validateCityBelongsToProvince(
  cityId: number,
  provinceId: number,
) {
  const city = await this.prisma.ciudades.findFirst({
    where: {
      id: cityId,
      provincia_id: provinceId,
    },
  });

  if (!city) {
    throw new BadRequestException(
      'La ciudad no pertenece a la provincia seleccionada.',
    );
  }

  return city;
}

private async validateCurrentPassword(
  userId: number,
  currentPassword: string,
) {
  const user = await this.validateUser(userId);

  const isValidPassword = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  if (!isValidPassword) {
    throw new UnauthorizedException('La contraseña actual es incorrecta.');
  }

  return user;
}

private async validatePhoneNumber(
  phoneNumber: string,
  userId: number,
) {
  const existingUser = await this.prisma.usuarios.findFirst({
    where: {
      phoneNumber,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingUser) {
    throw new BadRequestException(
      'El número de teléfono ya se encuentra registrado.',
    );
  }
}

  // ============================================================
  // UTILIDADES
  // ============================================================

  private normalizePhone(phoneNumber: string): string {
  if (!phoneNumber) {
    return phoneNumber;
  }

  return phoneNumber
    .trim()
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '');
}

  private async hashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = 10;

  return await bcrypt.hash(password, SALT_ROUNDS);
}
}
