import prisma from '../config/db';
import type { DatosProducto } from '../services/producto.service';

export class ProductoRepository {
    // Trae cada producto con su categoría y solo su precio más reciente (el vigente).
    async findAll() {
        return await prisma.producto.findMany({
            include: {
                categoria: true,
                precios: {
                    orderBy: { fecha_desde: 'desc' },
                    take: 1
                }
            },
            orderBy: { nombre: 'asc' }
        });
    }

    async create(datos: DatosProducto) {
        return await prisma.producto.create({
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                tipo: datos.tipo,
                id_categoria: datos.id_categoria,
                precios: {
                    create: {
                        precio: datos.precio
                    }
                }
            }
        });
    }

    async delete(id: number) {
        return await prisma.producto.delete({ where: { id } });
    }

    // El precio no se guarda en producto: se maneja aparte en precio_producto.
    async update(id: number, datos: DatosProducto) {
        return await prisma.producto.update({
            where: { id },
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                tipo: datos.tipo,
                id_categoria: datos.id_categoria
            }
        });
    }

    async findById(id: number) {
        return await prisma.producto.findUnique({
            where: { id }
        });
    }

    async findByNombre(nombre: string) {
        return await prisma.producto.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                    mode: 'insensitive'
                }
            }
        });
    }

    async countDetallesComanda(id: number) {
        return await prisma.detalle_comanda.count({
            where: { id_producto: id }
        });
    }
}
