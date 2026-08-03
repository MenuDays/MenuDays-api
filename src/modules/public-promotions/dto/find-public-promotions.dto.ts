import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Las promociones públicas usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicPromotionsDto extends FindRestaurantsDto {}