import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { rol_usuario } from '@prisma/client';

import { RestaurantsAdminService } from '../services/restaurants-admin.service';
import { UpdateRestaurantStatusDto } from '../dto/update-restaurant-status.dto';

@ApiTags('Admin - Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(rol_usuario.administrador)
@Controller('admin/restaurants')
export class RestaurantsAdminController {
  constructor(
    private readonly restaurantsAdminService: RestaurantsAdminService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener el listado de restaurantes',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    description: 'Filtrar por estado de cuenta',
    example: 'activo',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filtrar por nombre comercial',
    example: 'Pizzería Don Carlos',
  })
  getAllRestaurants(
    @Query('estado') estado?: string,
    @Query('name') name?: string,
  ) {
    return this.restaurantsAdminService.getAllRestaurants({
      estado,
      name,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener el detalle de un restaurante',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del restaurante',
  })
  getRestaurantById(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsAdminService.getRestaurantById(BigInt(id));
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Pausar, reactivar o eliminar un restaurante',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del restaurante',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantStatusDto,
  ) {
    return this.restaurantsAdminService.updateStatus(BigInt(id), dto);
  }
}
