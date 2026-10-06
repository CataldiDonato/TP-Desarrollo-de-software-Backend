import prisma from './src/config/db.ts';
import { hashPassword } from './src/utils/password.ts';

async function main() {
  const passwordHasheada = await hashPassword('1234');
  await prisma.usuario.update({
    where: { email: 'tomas@mozo.com' },
    data: { contrasenia: passwordHasheada }
  });
  console.log('Contraseña de tomas@mozo.com actualizada correctamente a hash.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
