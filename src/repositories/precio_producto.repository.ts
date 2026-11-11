import prisma from '../config/db';

export class Precio_productoRepository{

    async getUltimoPrecio(id_producto:number){
        return await prisma.precio_producto.findFirst({
            where: {id_producto},
            orderBy: {fecha_desde: 'desc'}
        });
    }

    async findAll(id_producto:number){
        return await prisma.precio_producto.findMany({
            where: {id_producto},
            orderBy: {fecha_desde: 'desc'}
        });
    }

    async create(id_producto:number, precio: number){
        return await prisma.precio_producto.create({
            data: {
                id_producto:id_producto,
                precio:precio
            }
        });
    }
    
}
