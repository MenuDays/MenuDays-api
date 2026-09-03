import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FindPublicSearchDto } from '../dto/find-public-search.dto';
import { PublicSearchService } from '../services/public-search.service';

@ApiTags('Public Search')
@Controller('public/search')
export class PublicSearchController {
  constructor(private readonly publicSearchService: PublicSearchService) {}

  @Get()
  @ApiOperation({
    summary:
      'Búsqueda transversal (menús, platos, promociones y restaurantes) para el comensal',
  })
  search(@Query() filters: FindPublicSearchDto) {
    return this.publicSearchService.search(filters);
  }
}
