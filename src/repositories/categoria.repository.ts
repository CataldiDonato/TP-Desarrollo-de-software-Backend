import prisma from '../config/db';

export class CategoriaRepository {
    async findAll() {
        return await prisma.categoria.findMany();
    }

    async create(nombre: string) {
        return await prisma.categoria.create({data: {nombre}});
    };

    async delete(id: number) {
        return await prisma.categoria.delete({where: {id}});
    }

    async update(id: number, nombre: string){
        return await prisma.categoria.update({where: {id}, data: {nombre}})
    }
}
