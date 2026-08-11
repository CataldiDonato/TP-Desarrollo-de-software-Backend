import prisma from '../config/db';
import { UpdateProducto } from '../services/producto.service';


export class ProductoRepository {
    async findAll() {
        return await prisma.producto.findMany();
    }

    async create(datos: UpdateProducto) {
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
        return await prisma.producto.delete({where: {id}});
    }

    async update(id: number, datos: UpdateProducto) {
    const { precio, ...datosProducto } = datos;

    return await prisma.producto.update({
        where: { id },
        data: datosProducto 
    });
}

    async findById(id: number) {
    return await prisma.producto.findUnique({
        where: { id }
    });
    }

    async findByNombre(nombre: string){
        return await prisma.producto.findFirst(
            {where: {
                nombre:{
                    equals: nombre,
                    mode: 'insensitive'
                }
            }
        });   
    }
}
