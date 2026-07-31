import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RestaurantRequestsService } from '../services/restaurant-requests.service';
import { CreateRestaurantRequestDto } from '../dto/create-restaurant-request.dto';

@ApiTags('Restaurant Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant-requests')
export class RestaurantRequestsController {
  constructor(
    private readonly restaurantRequestsService: RestaurantRequestsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una solicitud para convertirse en restaurante',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de la solicitud junto con el logo y la cédula frontal y dorsal.',
    schema: {
      type: 'object',
      properties: {
        commercialName: {
          type: 'string',
          example: 'Pizzería Don Carlos',
        },
        description: {
          type: 'string',
          example: 'Especialistas en pizzas artesanales.',
        },
        address: {
          type: 'string',
          example: 'Av. Principal 123',
        },
        provinceId: {
          type: 'number',
          example: 1,
        },
        cityId: {
          type: 'number',
          example: 5,
        },
        latitude: {
          type: 'number',
          example: -2.170998,
        },
        longitude: {
          type: 'number',
          example: -79.922359,
        },
        contactPhone: {
          type: 'string',
          example: '0991234567',
        },
        socialNetworks: {
          type: 'string',
          example:
            '{"facebook":"https://facebook.com/restaurante","instagram":"https://instagram.com/restaurante","tiktok":"https://tiktok.com/@restaurante","whatsapp":"0991234567"}',
        },
        schedules: {
          type: 'string',
          example:
            '[{"day":1,"openingHour":"08:00","closingHour":"18:00","closed":false},{"day":2,"openingHour":"08:00","closingHour":"18:00","closed":false}]',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
        cedulaFront: {
  type: 'string',
  format: 'binary',
},
cedulaBack: {
  type: 'string',
  format: 'binary',
},
      },
      required: [
        'commercialName',
        'address',
        'provinceId',
        'cityId',
        'latitude',
        'longitude',
        'contactPhone',
        'logo',
        'cedulaFront',
        'cedulaBack',
        'schedules',
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'cedulaFront', maxCount: 1 },
      { name: 'cedulaBack', maxCount: 1 },
    ]),
  )
  async createRequest(
    @Request() req,
    @Body() dto: CreateRestaurantRequestDto,
    @UploadedFiles()
    files: {
  logo?: Express.Multer.File[];
  cedulaFront?: Express.Multer.File[];
  cedulaBack?: Express.Multer.File[];
},
  ) {
    // Procesar redes sociales sin romper nunca el endpoint
    if (dto.socialNetworks) {
      if (typeof dto.socialNetworks === 'string') {
        try {
          dto.socialNetworks = JSON.parse(dto.socialNetworks as any);
        } catch {
          throw new BadRequestException(
            'El campo socialNetworks debe ser un JSON válido.',
          );
        }
      }
    } else {
      dto.socialNetworks = {};
    }

    // Procesar horarios sin romper nunca el endpoint
  if (dto.schedules) {
    if (typeof dto.schedules === 'string') {
      try {
        dto.schedules = JSON.parse(dto.schedules as any);
      } catch {
        throw new BadRequestException(
          'El campo schedules debe ser un JSON válido.',
        );
      }
    }
  } else {
    dto.schedules = [];
  }

    return this.restaurantRequestsService.createRequest(
      req.user.id,
      dto,
      files.logo?.[0],
      files.cedulaFront?.[0],
      files.cedulaBack?.[0],
    );
  }

  @Get('status')
  @ApiOperation({
    summary: 'Consultar el estado de la solicitud del usuario autenticado',
  })
  async getRequestStatus(@Request() req) {
    return this.restaurantRequestsService.getRequestStatus(req.user.id);
  }
}