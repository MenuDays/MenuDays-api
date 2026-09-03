import { Injectable } from '@nestjs/common';

import { ExploreService } from '../../explore/services/explore.service';
import { PublicDishService } from '../../public-dishes/services/public-dish.service';
import { PublicMenuService } from '../../public-menus/services/public-menu.service';
import { PublicPromotionService } from '../../public-promotions/services/public-promotion.service';
import { FindPublicSearchDto } from '../dto/find-public-search.dto';

// ==========================================================================
// Búsqueda transversal del comensal (GET /public/search).
//
// Reusa TAL CUAL los tres servicios públicos existentes para traer los
// menús / platos / promociones vigentes dentro del mismo alcance
// geográfico que el resto de la app (mismo criterio de vigencia, radio y
// restaurante activo), y ExploreService para los restaurantes. El texto
// se filtra y rankea en memoria: el volumen actual es bajo y así la
// búsqueda es tolerante a acentos y mayúsculas sin depender de ninguna
// extensión de Postgres (mismo enfoque que ExploreService, que filtra la
// distancia en JS).
// ==========================================================================

export type ResultTipo = 'plato' | 'menu' | 'promocion' | 'restaurante';

export interface SearchResult {
  tipo: ResultTipo;
  id: unknown;
  nombre: string;
  descripcion: string | null;
  precio: unknown | null;
  precioOferta: unknown | null;
  imagen: string | null;
  restaurante: { id: unknown; nombre: string } | null;
  distancia: number | null;
  categoria: string | null;
}

// "tres leches" / "TRES LECHES" / "tré leches" -> "tres leches".
// Marcas diacríticas combinantes (U+0300..U+036F) que quedan sueltas
// tras normalize('NFD') -- sacarlas = "café" -> "cafe".
const COMBINING_MARKS = /[̀-ͯ]/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .trim();
}

// Peso por tipo para el desempate (el spec pide priorizar plato > menú >
// promoción > restaurante ante relevancia de texto pareja).
const TIPO_WEIGHT: Record<ResultTipo, number> = {
  plato: 3,
  menu: 2,
  promocion: 1,
  restaurante: 0,
};

@Injectable()
export class PublicSearchService {
  constructor(
    private readonly exploreService: ExploreService,
    private readonly publicMenuService: PublicMenuService,
    private readonly publicDishService: PublicDishService,
    private readonly publicPromotionService: PublicPromotionService,
  ) {}

  async search(filters: FindPublicSearchDto): Promise<SearchResult[]> {
    const query = normalize(filters.search ?? '');
    const tokens = query.split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      return [];
    }

    // Alcance geográfico: los servicios públicos ya lo resuelven con
    // estos mismos filtros. Se les saca `search` para que devuelvan todo
    // lo vigente del área y el filtrado de texto lo hace este servicio.
    const scopeFilters = { ...filters, search: undefined, limit: undefined };

    const [menus, dishes, promotions, restaurants] = await Promise.all([
      this.publicMenuService.findAvailable(scopeFilters),
      this.publicDishService.findAvailable(scopeFilters),
      this.publicPromotionService.findAvailable(scopeFilters),
      this.exploreService.findRestaurants(scopeFilters),
    ]);

    const candidates: (SearchResult & { _haystack: string; _nombreNorm: string })[] =
      [];

    for (const menu of menus as any[]) {
      candidates.push(
        this.buildCandidate({
          tipo: 'menu',
          id: menu.id,
          nombre: menu.nombre ?? '',
          descripcion: menu.descripcion ?? null,
          precio: menu.precio ?? null,
          precioOferta: null,
          imagen: menu.foto_url ?? null,
          categoria: menu.categorias?.nombre ?? null,
          tags: Array.isArray(menu.tags) ? menu.tags : [],
          restaurante: menu.restaurante
            ? {
                id: menu.restaurante.id,
                nombre: menu.restaurante.nombre_comercial ?? '',
              }
            : null,
          distancia: menu.distancia ?? null,
        }),
      );
    }

    for (const dish of dishes as any[]) {
      candidates.push(
        this.buildCandidate({
          tipo: 'plato',
          id: dish.id,
          nombre: dish.nombre ?? '',
          descripcion: dish.descripcion ?? null,
          precio: dish.precio ?? null,
          precioOferta: dish.en_oferta ? (dish.precio_oferta ?? null) : null,
          imagen: dish.plato_imagenes?.[0]?.url ?? null,
          categoria: dish.categorias?.nombre ?? null,
          tags: [],
          restaurante: dish.restaurante
            ? {
                id: dish.restaurante.id,
                nombre: dish.restaurante.nombre_comercial ?? '',
              }
            : null,
          distancia: dish.distancia ?? null,
        }),
      );
    }

    for (const promo of promotions as any[]) {
      candidates.push(
        this.buildCandidate({
          tipo: 'promocion',
          id: promo.id,
          nombre: promo.titulo ?? '',
          descripcion: promo.descripcion ?? null,
          precio: promo.precio ?? null,
          precioOferta: null,
          imagen: promo.imagen_url ?? null,
          categoria: promo.categorias?.nombre ?? null,
          tags: [],
          restaurante: promo.restaurante
            ? {
                id: promo.restaurante.id,
                nombre: promo.restaurante.nombre_comercial ?? '',
              }
            : null,
          distancia: promo.distancia ?? null,
        }),
      );
    }

    for (const restaurant of restaurants as any[]) {
      candidates.push(
        this.buildCandidate({
          tipo: 'restaurante',
          id: restaurant.id,
          nombre: restaurant.nombre_comercial ?? '',
          descripcion: restaurant.descripcion ?? null,
          precio: null,
          precioOferta: null,
          imagen: restaurant.logo_url ?? restaurant.portada_url ?? null,
          categoria: null,
          tags: [],
          restaurante: null,
          distancia: restaurant.distancia ?? null,
        }),
      );
    }

    const limit = filters.limit ?? 30;

    return candidates
      .map((candidate) => ({
        candidate,
        score: this.score(candidate, query, tokens),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ candidate }) => {
        // Sacar los campos internos de matching antes de devolver.
        const { _haystack, _nombreNorm, ...result } = candidate;
        void _haystack;
        void _nombreNorm;
        return result;
      });
  }

  private buildCandidate(input: {
    tipo: ResultTipo;
    id: unknown;
    nombre: string;
    descripcion: string | null;
    precio: unknown | null;
    precioOferta: unknown | null;
    imagen: string | null;
    categoria: string | null;
    tags: string[];
    restaurante: { id: unknown; nombre: string } | null;
    distancia: number | null;
  }): SearchResult & { _haystack: string; _nombreNorm: string } {
    const haystackParts = [
      input.nombre,
      input.descripcion ?? '',
      input.categoria ?? '',
      input.tags.join(' '),
      input.restaurante?.nombre ?? '',
    ];

    return {
      tipo: input.tipo,
      id: input.id,
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio ?? null,
      precioOferta: input.precioOferta ?? null,
      imagen: input.imagen,
      restaurante: input.restaurante,
      distancia: input.distancia,
      categoria: input.categoria,
      _haystack: normalize(haystackParts.filter(Boolean).join(' ')),
      _nombreNorm: normalize(input.nombre),
    };
  }

  // 0 = no matchea. Cuanto más alto, más relevante.
  private score(
    candidate: SearchResult & { _haystack: string; _nombreNorm: string },
    query: string,
    tokens: string[],
  ): number {
    // Todos los tokens tienen que aparecer en algún lado ("tre leches"
    // encuentra "Torta tres leches").
    const allTokensInHaystack = tokens.every((token) =>
      candidate._haystack.includes(token),
    );
    if (!allTokensInHaystack) {
      return 0;
    }

    const name = candidate._nombreNorm;
    let base: number;
    if (name === query) {
      base = 100;
    } else if (name.startsWith(query)) {
      base = 60;
    } else if (name.includes(query)) {
      base = 40;
    } else if (tokens.every((token) => name.includes(token))) {
      base = 25;
    } else {
      base = 10;
    }

    return base + TIPO_WEIGHT[candidate.tipo];
  }
}
