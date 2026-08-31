import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  estado_pedido,
  item_pedido_tipo,
  metodo_entrega,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { RestaurantOrdersFilterDto } from '../dto/restaurant-orders-filter.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UserOrdersFilterDto } from '../dto/user-orders-filter.dto';

const orderInclude = {
  usuarios: true,
  restaurantes: true,
  menus_del_dia: true,
  promociones: true,
  platos: { include: { plato_imagenes: { orderBy: { orden: 'asc' } } } },
} satisfies Prisma.pedidosInclude;

type OrderWithRelations = Prisma.pedidosGetPayload<{
  include: typeof orderInclude;
}>;

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: bigint, createOrderDto: CreateOrderDto) {
    const {
      menuId,
      promotionId,
      dishId,
      observaciones,
      metodoEntrega = metodo_entrega.RETIRO_EN_LOCAL,
    } = createOrderDto;
    this.validateOrderType(menuId, promotionId, dishId);

    const user = await this.prisma.usuarios.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    let restauranteId: bigint;
    let precioTotal: Prisma.Decimal;
    let tipoItem: item_pedido_tipo;
    let menuDiaId: bigint | null = null;
    let promocionId: bigint | null = null;
    let platoId: bigint | null = null;

    if (menuId !== undefined) {
      const menu = await this.prisma.menus_del_dia.findUnique({
        where: { id: BigInt(menuId) },
      });
      if (!menu || menu.deleted_at)
        throw new NotFoundException('El menú no existe.');
      restauranteId = menu.restaurante_id;
      precioTotal = menu.precio;
      tipoItem = item_pedido_tipo.menu_dia;
      menuDiaId = menu.id;
    } else if (promotionId !== undefined) {
      const promotion = await this.prisma.promociones.findUnique({
        where: { id: BigInt(promotionId) },
      });
      if (!promotion || promotion.deleted_at) {
        throw new NotFoundException('La promoción no existe.');
      }
      restauranteId = promotion.restaurante_id;
      precioTotal = promotion.precio;
      tipoItem = item_pedido_tipo.promocion;
      promocionId = promotion.id;
    } else {
      const dish = await this.prisma.platos.findUnique({
        where: { id: BigInt(dishId!) },
      });
      if (!dish || dish.deleted_at)
        throw new NotFoundException('El plato no existe.');
      restauranteId = dish.restaurante_id;
      precioTotal = dish.precio;
      tipoItem = item_pedido_tipo.plato;
      platoId = dish.id;
    }

    if (metodoEntrega === metodo_entrega.DELIVERY) {
      await this.validateDeliveryAvailability(restauranteId);
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.pedidos.create({
        data: {
          usuario_id: userId,
          restaurante_id: restauranteId,
          tipo_item: tipoItem,
          menu_dia_id: menuDiaId,
          promocion_id: promocionId,
          plato_id: platoId,
          precio_total: precioTotal,
          observaciones,
          metodo_entrega: metodoEntrega,
        },
      });
      await tx.pedido_historial_estados.create({
        data: {
          pedido_id: createdOrder.id,
          estado_nuevo: estado_pedido.pendiente,
          modificado_por: userId,
        },
      });
      return createdOrder;
    });

    return {
      id: order.id,
      estado: order.estado,
      codigo_unico: order.codigo_unico,
      tipo: order.tipo_item,
      metodoEntrega: order.metodo_entrega,
      fechaPedido: order.created_at,
      total: order.precio_total,
    };
  }

  async getHistory(userId: bigint, filters: UserOrdersFilterDto) {
    const orders = await this.prisma.pedidos.findMany({
      where: {
        usuario_id: userId,
        ...(filters.estado && { estado: filters.estado }),
      },
      include: orderInclude,
      orderBy: { created_at: 'desc' },
    });
    return orders.map((order) => this.serializeListOrder(order));
  }

  async findOne(userId: bigint, orderId: number) {
    // includeHistory=true: el detalle del comensal ahora también trae el
    // historial de estados (pedido_historial_estados). Sirve para la línea
    // de tiempo del recibo ("Pendiente ✓ -> Aceptado ✓ -> Preparando ...").
    // No rompe nada: serializeOrder() ya agrega `historial` de forma
    // condicional (igual que en getRestaurantOrder), los clientes que no lo
    // usan simplemente ignoran esa clave.
    const order = await this.findOrderById(BigInt(orderId), true);
    this.validateUserOwnership(order, userId);
    return this.serializeOrder(order);
  }

  async getWhatsAppSummary(userId: bigint, orderId: number) {
    const order = await this.findOrderById(BigInt(orderId));
    this.validateUserOwnership(order, userId);

    return {
      mensajeWhatsapp: this.buildWhatsAppSummary(order),
    };
  }

  async getRestaurantOrders(
    userId: bigint,
    filters: RestaurantOrdersFilterDto,
  ) {
    const restaurant = await this.findRestaurantByUserId(userId);
    const where: Prisma.pedidosWhereInput = { restaurante_id: restaurant.id };
    if (filters.estado) where.estado = filters.estado;
    if (filters.fecha) {
      const date = new Date(filters.fecha);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.created_at = { gte: date, lt: nextDay };
    }
    const orders = await this.prisma.pedidos.findMany({
      where,
      include: orderInclude,
      orderBy: { created_at: 'desc' },
    });
    return orders.map((order) => this.serializeListOrder(order));
  }

  async getRestaurantOrder(userId: bigint, orderId: number) {
    const restaurant = await this.findRestaurantByUserId(userId);
    const order = await this.findOrderById(BigInt(orderId), true);
    this.validateRestaurantOwnership(order, restaurant.id);
    return this.serializeOrder(order);
  }

  async updateStatus(
    userId: bigint,
    orderId: number,
    dto: UpdateOrderStatusDto,
  ) {
    const restaurant = await this.findRestaurantByUserId(userId);
    const order = await this.findOrderById(BigInt(orderId));
    this.validateRestaurantOwnership(order, restaurant.id);
    this.validateStatusTransition(order.estado, dto.estado);

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.pedidos.update({
        where: { id: order.id },
        data: { estado: dto.estado, updated_at: new Date() },
      });
      await tx.pedido_historial_estados.create({
        data: {
          pedido_id: order.id,
          estado_anterior: order.estado,
          estado_nuevo: dto.estado,
          modificado_por: userId,
        },
      });
      return updated;
    });
    return {
      id: updatedOrder.id,
      estado: updatedOrder.estado,
      updatedAt: updatedOrder.updated_at,
    };
  }

  private async findRestaurantByUserId(userId: bigint) {
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: { usuario_id: userId },
    });
    if (!restaurant)
      throw new NotFoundException(
        'No se encontró un restaurante asociado al usuario.',
      );
    return restaurant;
  }

  private async validateDeliveryAvailability(restauranteId: bigint) {
    const restaurant = await this.prisma.restaurantes.findFirst({
      where: {
        id: restauranteId,
        deleted_at: null,
        estado_cuenta: 'activo',
      },
      select: {
        ofrece_delivery: true,
        nombre_delivery: true,
      },
    });

    if (!restaurant?.ofrece_delivery || !restaurant.nombre_delivery) {
      throw new BadRequestException(
        'El restaurante no tiene delivery disponible.',
      );
    }
  }

  private async findOrderById(orderId: bigint, includeHistory = false) {
    const order = await this.prisma.pedidos.findUnique({
      where: { id: orderId },
      include: includeHistory
        ? {
            ...orderInclude,
            pedido_historial_estados: { orderBy: { created_at: 'asc' } },
          }
        : orderInclude,
    });
    if (!order) throw new NotFoundException('No se encontró el pedido.');
    return order;
  }

  private validateUserOwnership(
  order: { usuario_id: bigint },
  userId: bigint | string,
) {
  if (order.usuario_id.toString() !== userId.toString()) {
    throw new ForbiddenException(
      'No tienes permisos para acceder a este pedido.',
    );
    
  }
}

  private validateRestaurantOwnership(
  order: { restaurante_id: bigint },
  restaurantId: bigint | string,
) {
  if (
    order.restaurante_id.toString() !==
    restaurantId.toString()
  ) {
    throw new ForbiddenException(
      'No tienes permisos para gestionar este pedido.',
    );
  }
}

  private validateOrderType(
    menuId?: number,
    promotionId?: number,
    dishId?: number,
  ) {
    if (
      [menuId, promotionId, dishId].filter((id) => id !== undefined).length !==
      1
    ) {
      throw new BadRequestException(
        'El pedido debe estar asociado a un único menú, promoción o plato.',
      );
    }
  }

  private validateStatusTransition(
    current: estado_pedido,
    next: estado_pedido,
  ) {
    const transitions: Record<estado_pedido, estado_pedido[]> = {
      pendiente: [
        estado_pedido.aceptado,
        estado_pedido.rechazado,
        estado_pedido.cancelado,
      ],
      aceptado: [estado_pedido.preparando, estado_pedido.cancelado],
      preparando: [estado_pedido.listo, estado_pedido.cancelado],
      listo: [estado_pedido.entregado],
      entregado: [],
      rechazado: [],
      cancelado: [],
    };
    if (!transitions[current].includes(next)) {
      throw new ConflictException(
        `No es posible cambiar el estado de "${current}" a "${next}".`,
      );
    }
  }

  private serializeListOrder(order: OrderWithRelations) {
    const product = this.product(order);
    return {
      id: order.id,
      codigo_unico: order.codigo_unico,
      usuario: {
        id: order.usuarios.id,
        nombre: `${order.usuarios.nombre} ${order.usuarios.apellido}`,
        foto: order.usuarios.foto_perfil_url,
      },
      restaurante: {
        id: order.restaurantes.id,
        nombre: order.restaurantes.nombre_comercial,
      },
      tipo: order.tipo_item,
      nombre: product.nombre,
      imagen: product.imagen,
      estado: order.estado,
      metodoEntrega: order.metodo_entrega,
      total: order.precio_total,
      fecha: order.created_at,
    };
  }

  private serializeOrder(
    order: OrderWithRelations & { pedido_historial_estados?: unknown[] },
  ) {
    const product = this.product(order);
    return {
      id: order.id,
      codigo_unico: order.codigo_unico,
      usuario: {
        id: order.usuarios.id,
        nombre: `${order.usuarios.nombre} ${order.usuarios.apellido}`,
        foto: order.usuarios.foto_perfil_url,
      },
      restaurante: {
        id: order.restaurantes.id,
        nombre: order.restaurantes.nombre_comercial,
        portada: order.restaurantes.portada_url,
      },
      pedido: {
        tipo: order.tipo_item,
        estado: order.estado,
        total: order.precio_total,
        observaciones: order.observaciones,
        metodoEntrega: order.metodo_entrega,
        fecha: order.created_at,
      },
      producto: product,
      ...(order.pedido_historial_estados && {
        historial: order.pedido_historial_estados,
      }),
    };
  }

  private product(order: OrderWithRelations) {
    if (order.tipo_item === item_pedido_tipo.menu_dia) {
      return {
        id: order.menus_del_dia?.id,
        nombre: order.menus_del_dia?.nombre,
        imagen: order.menus_del_dia?.foto_url,
        precio: order.menus_del_dia?.precio,
      };
    }
    if (order.tipo_item === item_pedido_tipo.promocion) {
      return {
        id: order.promociones?.id,
        nombre: order.promociones?.titulo,
        imagen: order.promociones?.imagen_url,
        precio: order.promociones?.precio,
      };
    }
    return {
      id: order.platos?.id,
      nombre: order.platos?.nombre,
      imagen: order.platos?.plato_imagenes[0]?.url,
      precio: order.platos?.precio,
    };
  }

  private buildWhatsAppSummary(order: OrderWithRelations) {
    const product = this.product(order);
    const customerName = `${order.usuarios.nombre} ${order.usuarios.apellido}`;
    const deliveryMethod =
      order.metodo_entrega === metodo_entrega.DELIVERY
        ? `Delivery${
            order.restaurantes.nombre_delivery
              ? ` (${order.restaurantes.nombre_delivery})`
              : ''
          }`
        : 'Retiro en el local.';

    const lines = [
      `Hola, soy ${customerName}.`,
      '',
      'Quisiera realizar el siguiente pedido:',
      '',
      `- ${product.nombre ?? 'Producto'}`,
    ];

    if (order.observaciones) {
      lines.push('', 'Observaciones:', order.observaciones);
    }

    lines.push('', 'Método de entrega:', deliveryMethod);

    return lines.join('\n');
  }
}
