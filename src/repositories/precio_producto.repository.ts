import prisma from '../config/db';
import type { Prisma } from '../generated/client';

// Cliente de base de datos: el prisma global o el de una transacción en curso.
type DbClient = Prisma.TransactionClient;

export class Precio_productoRepository{

    async getUltimoPrecio(id_producto:number, db: DbClient = prisma){
        return await db.precio_producto.findFirst({
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

    async create(id_producto:number, precio: number, db: DbClient = prisma){
        return await db.precio_producto.create({
            data: {
                id_producto:id_producto,
                precio:precio
            }
        });
    }
    
}
