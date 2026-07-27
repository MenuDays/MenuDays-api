import { PrismaClient, rol_usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function adminSeed(prisma: PrismaClient) {
  const admins = [
    'alex_poscard@outlook.es',
    'varelabelencita23@gmail.com',
  ];

  const passwordHash = await bcrypt.hash(
    'Admin123*',
    12,
  );

  for (const email of admins) {
    const adminExists =
      await prisma.usuarios.findUnique({
        where: {
          email,
        },
      });

    if (adminExists) {
      console.log(
        `Administrador ${email} ya existe`,
      );
      continue;
    }

    await prisma.usuarios.create({
      data: {
        nombre: 'Administrador',
        apellido: 'MenuDays',
        email,
        password_hash: passwordHash,
        rol: rol_usuario.administrador,
        estado: 'activo',
        email_verificado: true,
        radio_busqueda_km: 5,
      },
    });

    console.log(
      `Administrador ${email} creado`,
    );
  }
}