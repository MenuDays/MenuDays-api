import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SocialNetworksDto {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}
export class ScheduleDto {
  @Type(() => Number)
  @IsNumber()
  day!: number;

  @IsOptional()
  @IsString()
  openingHour!: string;

  @IsOptional()
  @IsString()
  closingHour!: string;

  @IsOptional()
  closed!: boolean;
}
export class CreateRestaurantRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  commercialName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;

  @Type(() => Number)
  @IsNumber()
  provinceId!: number;

  @Type(() => Number)
  @IsNumber()
  cityId!: number;

  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  contactPhone!: string;

  @IsOptional()
  socialNetworks?: SocialNetworksDto;

  @IsOptional()
  schedules?: ScheduleDto[];
}