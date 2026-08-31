import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * "Estos son los menús de hoy": el restaurante elige, con checkboxes en
 * la app, cuáles de sus menús ya creados quiere mostrar hoy -- sin tener
 * que volver a escribirlos. `ids` puede venir vacío (no mostrar ninguno).
 */
export class SetTodayMenusDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ids!: number[];
}
