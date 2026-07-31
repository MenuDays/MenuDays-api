import { PrismaClient } from '@prisma/client';

const categories = [
  { nombre: 'Bares', icono: 'Bares.png' },
  { nombre: 'Bebidas', icono: 'Bebidas.png' },
  { nombre: 'Bolones', icono: 'Bolones.png' },
  { nombre: 'Cafetería', icono: 'Cafetería.png' },
  { nombre: 'Cevicherías', icono: 'Cevicherías.png' },
  { nombre: 'Comida China', icono: 'Comida China.png' },
  { nombre: 'Comida Rápida', icono: 'Comida Rápida.png' },
  { nombre: 'Comida Típica', icono: 'Comida Típica.png' },
  { nombre: 'Desayunos', icono: 'Desayunos.png' },
  { nombre: 'Ejecutivo', icono: 'Ejecutivo.png' },
  { nombre: 'Empanadas', icono: 'Empanadas.png' },
  { nombre: 'Ensaladas', icono: 'Ensaladas.png' },
  { nombre: 'Hamburguesas', icono: 'Hamburguesas.png' },
  { nombre: 'Heladeria', icono: 'Heladeria.png' },
  { nombre: 'Mariscos', icono: 'Mariscos.png' },
  { nombre: 'Mexicana', icono: 'Mexicana.png' },
  { nombre: 'Panadería', icono: 'Panadería.png' },
  { nombre: 'Parrillas', icono: 'Parrillas.png' },
  { nombre: 'Pastas', icono: 'Pastas.png' },
  { nombre: 'Pizzas', icono: 'Pizzas.png' },
  { nombre: 'Pollo', icono: 'Pollo.png' },
  { nombre: 'Postres saludables', icono: 'Postres saludables.png' },
  { nombre: 'Postres', icono: 'Postres.png' },
  { nombre: 'Sandwiches', icono: 'Sandwiches.png' },
  { nombre: 'Sopas', icono: 'Sopas.png' },
  { nombre: 'Sushi', icono: 'Sushi.png' },
  { nombre: 'Vegana', icono: 'Vegana.png' },
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
        url: `src/assets/categorias/${category.icono}`,
      },
      create: {
        nombre: category.nombre,
        url: `src/assets/categorias/${category.icono}`,
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