import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from '../dto/create-order.dto';
import { RestaurantOrdersFilterDto } from '../dto/restaurant-orders-filter.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdateRestaurantOrderDto } from '../dto/update-restaurant-order.dto';
import { UserOrdersFilterDto } from '../dto/user-orders-filter.dto';
import { OrderService } from '../services/order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Crear pedido' })
  create(@CurrentUser('id') userId: bigint, @Body() dto: CreateOrderDto) {
    return this.orderService.create(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historial de mis pedidos' })
  getHistory(
    @CurrentUser('id') userId: bigint,
    @Query() filters: UserOrdersFilterDto,
  ) {
    return this.orderService.getHistory(userId, filters);
  }

  @Get('restaurant')
  @ApiOperation({ summary: 'Pedidos del restaurante' })
  getRestaurantOrders(
    @CurrentUser('id') userId: bigint,
    @Query() filters: RestaurantOrdersFilterDto,
  ) {
    return this.orderService.getRestaurantOrders(userId, filters);
  }

  @Get('restaurant/:id')
  @ApiOperation({ summary: 'Detalle de un pedido del restaurante' })
  getRestaurantOrder(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.getRestaurantOrder(userId, orderId);
  }

  @Patch('restaurant/:id/hide')
  @ApiOperation({
    summary: 'Ocultar un pedido concluido del listado del restaurante',
  })
  hideRestaurantOrder(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.hideForRestaurant(userId, orderId);
  }

  @Patch('restaurant/:id')
  @ApiOperation({
    summary: 'Editar un pedido (observaciones, método de entrega, total)',
  })
  updateRestaurantOrder(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateRestaurantOrderDto,
  ) {
    return this.orderService.updateRestaurantOrder(userId, orderId, dto);
  }

  @Patch(':id/hide')
  @ApiOperation({ summary: 'Ocultar un pedido concluido de mi historial' })
  hideOrder(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.hideForUser(userId, orderId);
  }

  @Get(':id/whatsapp-summary')
  @ApiOperation({ summary: 'Generar resumen del pedido para WhatsApp' })
  getWhatsAppSummary(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.getWhatsAppSummary(userId, orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un pedido' })
  findOne(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.findOne(userId, orderId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado del pedido' })
  updateStatus(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(userId, orderId, dto);
  }
}
