/**
 * Backfill de colecciones de menús para restaurantes que ya existían antes
 * de la migración `add_menu_colecciones`.
 *
 * Solo hace INSERT en `menu_colecciones`. No toca `menus_del_dia` en
 * absoluto -- los menús existentes deben conservar `coleccion_id = NULL`
 * (quedan como "Sin colección" en el frontend).
 *
 * Idempotente: usa createMany + skipDuplicates apoyado en el índice único
 * (restaurante_id, nombre), así que correrlo más de una vez no duplica
 * nada -- los restaurantes que ya tienen sus 4 colecciones simplemente se
 * saltean.
 *
 * Uso: npx ts-node scripts/backfill-menu-collections.ts
 */
import { PrismaClient } from '@prisma/client';
import { DEFAULT_MENU_COLLECTIONS } from '../src/modules/menu-collections/services/menu-collection.service';

const prisma = new PrismaClient();

async function main() {
  const restaurantes = await prisma.restaurantes.findMany({
    select: { id: true, nombre_comercial: true },
  });

  console.log(`Restaurantes encontrados: ${restaurantes.length}`);

  const data = restaurantes.flatMap((restaurante) =>
    DEFAULT_MENU_COLLECTIONS.map((nombre, index) => ({
      restaurante_id: restaurante.id,
      nombre,
      orden: index,
    })),
  );

  const result = await prisma.menu_colecciones.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Colecciones insertadas: ${result.count} (de ${data.length} candidatas -- el resto ya existían o son duplicados y se saltearon)`);

  const totalColecciones = await prisma.menu_colecciones.count();
  const menusConColeccionNoNula = await prisma.menus_del_dia.count({
    where: { NOT: { coleccion_id: null } },
  });

  console.log(`Total de colecciones en la BD ahora: ${totalColecciones}`);
  console.log(`Menús con coleccion_id distinto de NULL (debe seguir en 0): ${menusConColeccionNoNula}`);
}

main()
  .catch((e) => {
    console.error('ERROR en el backfill:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
