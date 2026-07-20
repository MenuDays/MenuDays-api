import { PrismaClient, rol_usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function adminSeed(prisma: PrismaClient) {
  const email = 'admin@menudays.com';

  const adminExists = await prisma.usuarios.findUnique({
    where: {
      email,
    },
  });

  if (adminExists) {
    console.log('Administrador ya existe');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin123*', 12);

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

  console.log('Administrador creado');
}