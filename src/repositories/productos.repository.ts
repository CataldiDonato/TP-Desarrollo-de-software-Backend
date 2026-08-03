import prisma from '../config/db';

export class ProductoRepository {
    async findAll() {
        return await prisma.categoria.findMany();
    }

    async create(nombre: string, descripcion: string) {
        return await prisma.categoria.create({data: {nombre, descripcion}});
    };

    async delete(id: number) {
        return await prisma.categoria.delete({where: {id}});
    }

    async update(id: number, nombre: string, descripcion: string) {
        return await prisma.categoria.update({where: {id}, data: {nombre, descripcion}})
    }
}
