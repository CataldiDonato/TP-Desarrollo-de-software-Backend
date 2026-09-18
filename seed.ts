import prisma from './src/config/db.ts';

async function main() {
  console.log('Iniciando carga de datos iniciales...');

  // 1. Crear un Mozo (Usuario) si no existe
  const mozo = await prisma.usuario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Tomas (Mozo de Prueba)',
      email: 'tomas@mozo.com',
      contrasenia: '1234',
      rol: 'Mozo'
    }
  });
  console.log('Mozo creado:', mozo);

  // 2. Crear un par de Mesas
  for (let i = 1; i <= 5; i++) {
    await prisma.mesa.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        capacidad: 4
      }
    });
  }
  console.log('5 Mesas creadas.');

  console.log('Carga inicial finalizada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
