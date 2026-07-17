import { PrismaClient } from '@prisma/client';

export async function seedProvincias(prisma: PrismaClient) {
  console.log('Cargando provincias de Ecuador...');

  const provincias = [
    { nombre: 'Azuay' },
    { nombre: 'Bolívar' },
    { nombre: 'Cañar' },
    { nombre: 'Carchi' },
    { nombre: 'Chimborazo' },
    { nombre: 'Cotopaxi' },
    { nombre: 'El Oro' },
    { nombre: 'Esmeraldas' },
    { nombre: 'Galápagos' },
    { nombre: 'Guayas' },
    { nombre: 'Imbabura' },
    { nombre: 'Loja' },
    { nombre: 'Los Ríos' },
    { nombre: 'Manabí' },
    { nombre: 'Morona Santiago' },
    { nombre: 'Napo' },
    { nombre: 'Orellana' },
    { nombre: 'Pastaza' },
    { nombre: 'Pichincha' },
    { nombre: 'Santa Elena' },
    { nombre: 'Santo Domingo de los Tsáchilas' },
    { nombre: 'Sucumbíos' },
    { nombre: 'Tungurahua' },
    { nombre: 'Zamora Chinchipe' },
  ];

  await prisma.provincias.createMany({
    data: provincias,
    skipDuplicates: true,
  });

  console.log(`✅ ${provincias.length} provincias cargadas.`);
}