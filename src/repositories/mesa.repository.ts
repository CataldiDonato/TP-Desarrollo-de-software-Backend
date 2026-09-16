import prisma from '../config/db';
import type {estado_mesa} from '../generated/enums';



export class MesaRepository{
    async findAll() {
        return await prisma.mesa.findMany();
    }

    async findById(id: number) {
        return await prisma.mesa.findUnique({
            where: { id }
        });
    }

    async findByEstado(estado: estado_mesa) {
        return await prisma.mesa.findMany({
            where: { estado }
        });
    }

    async create(capacidad: number) {
        return await prisma.mesa.create({
            data: {
                capacidad,
                estado: 'Libre'
            }
        });
    }


    
    async update(id: number, capacidad: number, estado: estado_mesa) {
        return await prisma.mesa.update({
            where: {id},
            data: {
                capacidad,
                estado,
            }
        });
    }

    async delete(id: number) {
        return await prisma.mesa.delete({
            where: {id}
        });
    }


}



