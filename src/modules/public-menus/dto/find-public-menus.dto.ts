import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Los menús públicos usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicMenusDto extends FindRestaurantsDto {}
