import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocationsService } from '../services/locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
  ) {}

  @Get('provincias')
  @ApiOperation({
    summary: 'Obtener todas las provincias de Ecuador',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de provincias obtenido correctamente.',
  })
  async getProvincias() {
    return this.locationsService.getProvincias();
  }

  @Get('provincias/:id/ciudades')
  @ApiOperation({
    summary: 'Obtener ciudades de una provincia',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de ciudades obtenido correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Provincia no encontrada.',
  })
  async getCiudadesByProvincia(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.locationsService.getCiudadesByProvincia(BigInt(id));
  }
}