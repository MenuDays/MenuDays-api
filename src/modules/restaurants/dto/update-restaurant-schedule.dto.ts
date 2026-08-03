import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantScheduleDto {
  @ApiProperty({
    example: 1,
    description: '1=Lunes ... 7=Domingo',
  })
  @IsInt()
  @Min(1)
  @Max(7)
  diaSemana!: number;

  @ApiProperty({
    example: '08:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  horaApertura?: string;

  @ApiProperty({
    example: '18:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  horaCierre?: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  cerrado!: boolean;
}