import { PrismaClient } from '@prisma/client';
import { seedProvincias } from './seeds/provincias.seed';
import { seedCiudades } from './seeds/ciudades.seed';
import { adminSeed } from './seeds/admin.seed';
import { seedCategories } from './seeds/categorias.seed';


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed de MenuDays...\n');

  await seedProvincias(prisma);
  await seedCiudades(prisma);
  await adminSeed(prisma);
  await seedCategories(prisma);

  console.log('✅ Seed de Categorías completado correctamente.');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });