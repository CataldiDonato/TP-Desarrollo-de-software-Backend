import prisma from '../config/db';
import type { RolUsuario } from '../utils/validation';

const usuarioPublico = {
    id: true,
    nombre: true,
    email: true,
    rol: true
} as const;

export class UsuarioRepository {
    async findAll() {
        return prisma.usuario.findMany({
            select: usuarioPublico,
            orderBy: { nombre: 'asc' }
        });
    }

    async findPublicById(id: number) {
        return prisma.usuario.findUnique({
            where: { id },
            select: usuarioPublico
        });
    }

    async findById(id: number) {
        return prisma.usuario.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return prisma.usuario.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });
    }

    async create(data: { nombre: string; email: string; contrasenia: string; rol: RolUsuario }) {
        return prisma.usuario.create({
            data,
            select: usuarioPublico
        });
    }

    async update(id: number, data: Partial<{ nombre: string; email: string; contrasenia: string; rol: RolUsuario }>) {
        return prisma.usuario.update({
            where: { id },
            data,
            select: usuarioPublico
        });
    }

    async countComandasComoMozo(idUsuario: number) {
        return prisma.comanda.count({
            where: { id_mozo: idUsuario }
        });
    }

    async delete(id: number) {
        return prisma.usuario.delete({
            where: { id },
            select: usuarioPublico
        });
    }
}
