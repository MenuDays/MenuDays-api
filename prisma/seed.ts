import { PrismaClient } from '@prisma/client';
import { seedProvincias } from './seeds/provincias.seed';
import { seedCiudades } from './seeds/ciudades.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed de MenuDays...\n');

  await seedProvincias(prisma);
  await seedCiudades(prisma);

  console.log('\n🎉 Seed completado correctamente.');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });