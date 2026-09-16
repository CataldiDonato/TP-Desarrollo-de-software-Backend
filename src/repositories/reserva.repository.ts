import prisma from '../config/db';
import { estado_reserva } from '../generated/enums';


export class ReservaRepository {
    async findAll() {
        return await prisma.reserva.findMany();
    }

    async findById(id: number) {
        return await prisma.reserva.findUnique({
            where: { id }
        });
    }

    async findByFecha(fecha: Date) {
        return await prisma.reserva.findMany({
            where: { fecha }
        });
    }


    async findByCliente(nombre: string) {
            return await prisma.reserva.findMany({
                where: { 
                    nombre_cliente: {
                        contains: nombre // contains busca coincidencias parciales, no hace falta el nombre exacto
                    }
                }
            });
    }



    async create (fecha: Date, cantidad_personas: number, id_mesa: number, nombre_cliente: string, telefono_cliente: string) {
        return await prisma.reserva.create({
            data: {
                fecha, 
                cantidad_personas,
                id_mesa,
                nombre_cliente,
                telefono_cliente,
                estado: "Confirmada"
            }
        });
    } 

    async update(id: number, fecha: Date, cantidad_personas: number, id_mesa: number, nombre_cliente: string, telefono_cliente: string, estado: estado_reserva, motivo_cancelacion?: string,) {
        return await prisma.reserva.update({
            where: {id},
            data: {
                fecha,
                cantidad_personas,
                id_mesa,
                nombre_cliente,
                telefono_cliente,
                estado,
                motivo_cancelacion,
            }
        });
    }

    
    
    //metodo exclusivo para modificar el estado y el motivo de cancelacion (sirve para el endpoint patch), así no hay q andar cambiando
    //constantemente todos los datos de la reserva 

    async updateEstado(id: number, estado: estado_reserva, motivo_cancelacion?: string) {
        return await prisma.reserva.update({
            where: { id },
            data: { 
                estado,
                motivo_cancelacion 
            }
        });
    }

    async delete(id: number) {
        return await prisma.reserva.delete({
            where: {id}
        });
    }
}
    

