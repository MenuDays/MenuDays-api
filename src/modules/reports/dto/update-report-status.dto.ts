import { ApiProperty } from '@nestjs/swagger';

import { estado_reporte } from '@prisma/client';

import {
  IsEnum,
} from 'class-validator';

export class UpdateReportStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del reporte',
    enum: estado_reporte,
    example: estado_reporte.archivado,
  })
  @IsEnum(estado_reporte)
  estado!: estado_reporte;
}