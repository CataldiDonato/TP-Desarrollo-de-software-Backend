import prisma from '../config/db';

export class mesaRepository {
    async findAll() {
        return await prisma.mesa.findMany();
    }
}
