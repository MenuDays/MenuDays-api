import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Los platos públicos usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicDishesDto extends FindRestaurantsDto {}