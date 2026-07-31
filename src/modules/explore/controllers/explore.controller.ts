import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FindRestaurantsDto } from '../dto/find-restaurants.dto';
import { ExploreService } from '../services/explore.service';

@ApiTags('Explore')
@Controller('explore')
export class ExploreController {
  constructor(
    private readonly exploreService: ExploreService,
  ) {}

  /**
   * Obtener el listado público de restaurantes.
   *
   * Permite buscar restaurantes mediante
   * distintos filtros como nombre,
   * provincia, ciudad y radio.
   */
  @Get('restaurants')
  @ApiOperation({
    summary: 'Explorar restaurantes',
  })
  async findRestaurants(
    @Query() filters: FindRestaurantsDto,
  ) {
    return this.exploreService.findRestaurants(filters);
  }
}