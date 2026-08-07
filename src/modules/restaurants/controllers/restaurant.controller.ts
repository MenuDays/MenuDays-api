import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  Put,
  Post,
} from '@nestjs/common';
import {
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRestaurantCategoriesDto } from '../dto/update-restaurant-categories.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { RestaurantService } from '../services/restaurant.service';

import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del restaurante autenticado',
  })
  getProfile(@Request() req: any) {
    return this.restaurantService.getProfile(
      req.user.id,
    );
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Actualizar perfil del restaurante',
  })
  updateProfile(
    @Request() req: any,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateProfile(
      req.user.id,
      updateRestaurantDto,
    );
  }
    @Get('categories')
  @ApiOperation({
    summary:
      'Obtener las categorías seleccionadas por el restaurante',
  })
  getCategories(@Request() req: any) {
    return this.restaurantService.getCategories(
      req.user.id,
    );
  }

  @Put('categories')
  @ApiOperation({
    summary:
      'Reemplazar las categorías del restaurante',
  })
  replaceCategories(
    @Request() req: any,
    @Body()
    updateRestaurantCategoriesDto: UpdateRestaurantCategoriesDto,
  ) {
    return this.restaurantService.replaceCategories(
      req.user.id,
      updateRestaurantCategoriesDto,
    );
  }
  @Get('dashboard')
@ApiOperation({
  summary: 'Obtener el dashboard del restaurante autenticado',
})
getDashboard(@Request() req: any) {
  return this.restaurantService.getDashboard(
    req.user.id,
  );
}
@Get('reviews')
@ApiOperation({
  summary:
    'Obtener todas las reseñas del restaurante autenticado',
})
getReviews(@Request() req: any) {
  return this.restaurantService.getReviews(
    req.user.id,
  );
}
@Post('profile/logo')
@ApiOperation({
  summary: 'Actualizar logo del restaurante',
})
@UseInterceptors(FileInterceptor('image'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    required: ['image'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
uploadLogo(
  @Request() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.restaurantService.uploadLogo(
    req.user.id,
    file,
  );
}

@Post('profile/cover')
@ApiOperation({
  summary: 'Actualizar portada del restaurante',
})
@UseInterceptors(FileInterceptor('image'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    required: ['image'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
uploadCover(
  @Request() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.restaurantService.uploadCover(
    req.user.id,
    file,
  );
}
}