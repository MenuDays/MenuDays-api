import { PrismaClient } from '@prisma/client';

const categories = [
  {
    nombre: 'Bares',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631127/Bares_jnxopg.png',
  },
  {
    nombre: 'Bebidas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631355/Bebidas_qlznki.png',
  },
  {
    nombre: 'Bolones',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631362/Bolones_jnp2il.png',
  },
  {
    nombre: 'Cafetería',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631359/Cafeter%C3%ADa_cxbh0l.png',
  },
  {
    nombre: 'Cevicherías',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631363/Cevicher%C3%ADas_z3clsa.png',
  },
  {
    nombre: 'Comida China',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631361/Comida_China_tljqui.png',
  },
  {
    nombre: 'Comida Rápida',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631358/Comida_R%C3%A1pida_wy9ejt.png',
  },
  {
    nombre: 'Comida Típica',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631408/Comida_T%C3%ADpica_z1zz8j.png',
  },
  {
    nombre: 'Desayunos',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631411/Desayunos_tqhbec.png',
  },
  {
    nombre: 'Ejecutivo',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631409/Ejecutivo_etgvfh.png',
  },
  {
    nombre: 'Empanadas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631405/Empanadas_yli0ya.png',
  },
  {
    nombre: 'Ensaladas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631414/Ensaladas_a0invm.png',
  },
  {
    nombre: 'Hamburguesas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631413/Hamburguesas_xv4abh.png',
  },
  {
    nombre: 'Heladeria',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631451/Heladeria_gnzrmi.png',
  },
  {
    nombre: 'Mariscos',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631454/Mariscos_rll3az.png',
  },
  {
    nombre: 'Mexicana',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631455/Mexicana_giwvit.png',
  },
  {
    nombre: 'Panadería',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631455/Panader%C3%ADa_tzaqjr.png',
  },
  {
    nombre: 'Parrillas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631456/Parrillas_m4jy1z.png',
  },
  {
    nombre: 'Pastas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631458/Pastas_mi5im9.png',
  },
  {
    nombre: 'Pizzas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631489/Pizzas_ijlueb.png',
  },
  {
    nombre: 'Pollo',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631487/Pollo_orsonj.png',
  },
  {
    nombre: 'Postres saludables',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631487/Postres_saludables_kn2vrw.png',
  },
  {
    nombre: 'Postres',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631513/Postres_wrr8y6.png',
  },
  {
    nombre: 'Sandwiches',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631514/Sandwiches_tliht3.png',
  },
  {
    nombre: 'Sopas',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631515/Sopas_dpvyj3.png',
  },
  {
    nombre: 'Sushi',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631520/Sushi_pvfv0p.png',
  },
  {
    nombre: 'Vegana',
    iconoUrl:
      'https://res.cloudinary.com/devfiioky/image/upload/v1785631521/Vegana_djlucp.png',
  },
];

export async function seedCategories(
  prisma: PrismaClient,
) {
  console.log('🍽️ Seedeando categorías...');

  for (const category of categories) {
    const icono = await prisma.iconos.upsert({
      where: {
        nombre: category.nombre,
      },
      update: {
        url: category.iconoUrl,
      },
      create: {
        nombre: category.nombre,
        url: category.iconoUrl,
      },
    });

    await prisma.categorias.upsert({
      where: {
        nombre: category.nombre,
      },
      update: {
        icono_id: icono.id,
      },
      create: {
        nombre: category.nombre,
        icono_id: icono.id,
      },
    });
  }

  console.log(
    `✅ ${categories.length} categorías creadas.`,
  );
}