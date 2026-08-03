import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsInt,
  IsBoolean,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  ValidateNested,
} from 'class-validator';

import { UpdateRestaurantPhoneDto } from './update-restaurant-phone.dto';
import { UpdateRestaurantSocialDto } from './update-restaurant-social.dto';
import { UpdateRestaurantScheduleDto } from './update-restaurant-schedule.dto';
export class UpdateRestaurantDto {
  @ApiPropertyOptional({
    example: 'La Casa de la Pasta',
    description: 'Nombre comercial del restaurante',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreComercial?: string;

  @ApiPropertyOptional({
    example: 'Especialistas en pastas artesanales y cocina italiana.',
    description: 'Descripción del restaurante',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'Av. Amazonas N40-71',
    description: 'Dirección del restaurante',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'ID de la ciudad',
  })
  @IsOptional()
  @IsInt()
  ciudadId?: number;

  @ApiPropertyOptional({
    example: -0.180653,
    description: 'Latitud de la ubicación',
  })
  @IsOptional()
  @IsLatitude()
  ubicacionLat?: number;

  @ApiPropertyOptional({
    example: -78.467834,
    description: 'Longitud de la ubicación',
  })
  @IsOptional()
  @IsLongitude()
  ubicacionLng?: number;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/.../logo.png',
    description: 'URL del logotipo',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/.../portada.png',
    description: 'URL de la imagen de portada',
  })
  @IsOptional()
  @IsUrl()
  portadaUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el restaurante ofrece delivery',
  })
  @IsOptional()
  @IsBoolean()
  ofreceDelivery?: boolean;

  @ApiPropertyOptional({
    example: 'Pedidos Ya',
    description: 'Nombre del servicio de delivery',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreDelivery?: string;

    @ApiPropertyOptional({
    type: [UpdateRestaurantPhoneDto],
    description: 'Teléfonos del restaurante',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRestaurantPhoneDto)
  telefonos?: UpdateRestaurantPhoneDto[];

  @ApiPropertyOptional({
    type: [UpdateRestaurantSocialDto],
    description: 'Redes sociales del restaurante',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRestaurantSocialDto)
  redesSociales?: UpdateRestaurantSocialDto[];

  @ApiPropertyOptional({
    type: [UpdateRestaurantScheduleDto],
    description: 'Horarios de atención',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRestaurantScheduleDto)
  horarios?: UpdateRestaurantScheduleDto[];
}
