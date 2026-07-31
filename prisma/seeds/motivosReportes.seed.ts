import { PrismaClient } from '@prisma/client';

const reportReasons = [
  { nombre: 'Información falsa' },
  { nombre: 'Contenido ofensivo' },
  { nombre: 'Publicidad engañosa' },
  { nombre: 'Datos desactualizados' },
  { nombre: 'Actividad sospechosa' },
  { nombre: 'Incumplimiento de normas' },
  { nombre: 'Otro' },
];

export async function seedReportReasons(
  prisma: PrismaClient,
) {
  console.log('🚩 Seedeando motivos de reporte...');

  for (const reason of reportReasons) {
    await prisma.motivos_reporte.create({
      data: {
        nombre: reason.nombre,
      },
    });
  }

  console.log(
    `✅ ${reportReasons.length} motivos de reporte creados.`,
  );
}