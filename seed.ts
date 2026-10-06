import prisma from './src/config/db';
import { hashPassword } from './src/utils/password';

// Carga datos iniciales para poder probar el sistema.
// Se puede correr varias veces: solo crea lo que todavía no existe.
// Uso: npm run seed

async function main() {
  console.log('Iniciando carga de datos iniciales...');

  // 1. Un usuario por cada rol. Si el email ya existe, no se toca.
  const usuarios = [
    { nombre: 'Admin', email: 'admin@restoflow.com', contrasenia: 'admin1234', rol: 'Administrador' as const },
    { nombre: 'Mozo', email: 'mozo@restoflow.com', contrasenia: 'mozo1234', rol: 'Mozo' as const },
    { nombre: 'Cocinero', email: 'cocinero@restoflow.com', contrasenia: 'cocinero1234', rol: 'Cocinero' as const }
  ];

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: {
        nombre: usuario.nombre,
        email: usuario.email,
        contrasenia: await hashPassword(usuario.contrasenia),
        rol: usuario.rol
      }
    });
  }
  console.log('Usuarios listos.');

  // 2. Mesas: solo si no hay ninguna cargada.
  const cantidadMesas = await prisma.mesa.count();
  if (cantidadMesas === 0) {
    const capacidades = [2, 2, 4, 4, 6];
    for (const capacidad of capacidades) {
      await prisma.mesa.create({ data: { capacidad } });
    }
  }
  console.log('Mesas listas.');

  // 3. Medios de pago: uno por cada tipo.
  const tipos = ['Efectivo', 'Transferencia', 'Tarjeta'] as const;
  for (const tipo of tipos) {
    const existe = await prisma.medio_de_pago.findFirst({ where: { tipo } });
    if (!existe) {
      await prisma.medio_de_pago.create({ data: { tipo } });
    }
  }
  console.log('Medios de pago listos.');

  // 4. Categorías y algunos productos de ejemplo: solo si no hay productos cargados.
  const cantidadProductos = await prisma.producto.count();
  if (cantidadProductos === 0) {
    // Si la categoría ya existe se reutiliza, si no se crea.
    const principales = await prisma.categoria.findFirst({ where: { nombre: 'Platos principales' } })
      ?? await prisma.categoria.create({ data: { nombre: 'Platos principales' } });
    const bebidas = await prisma.categoria.findFirst({ where: { nombre: 'Bebidas' } })
      ?? await prisma.categoria.create({ data: { nombre: 'Bebidas' } });

    const productos = [
      { nombre: 'Milanesa con papas', descripcion: 'Milanesa de ternera con papas fritas', tipo: 'Plato' as const, id_categoria: principales.id, precio: 12000 },
      { nombre: 'Hamburguesa completa', descripcion: 'Con lechuga, tomate, queso y huevo', tipo: 'Plato' as const, id_categoria: principales.id, precio: 9500 },
      { nombre: 'Gaseosa 500ml', descripcion: '', tipo: 'Bebida' as const, id_categoria: bebidas.id, precio: 2500 },
      { nombre: 'Agua sin gas', descripcion: '', tipo: 'Bebida' as const, id_categoria: bebidas.id, precio: 2000 }
    ];

    for (const producto of productos) {
      await prisma.producto.create({
        data: {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          tipo: producto.tipo,
          id_categoria: producto.id_categoria,
          precios: { create: { precio: producto.precio } }
        }
      });
    }
  }
  console.log('Productos listos.');

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
