import { UsuarioRepository } from '../repositories/usuario.repository';
import { AppError } from '../utils/app-error';
import { hashPassword } from '../utils/password';
import {
    isPlainObject,
    parseEmail,
    parseRol,
    requireText,
    type RolUsuario
} from '../utils/validation';

const repository = new UsuarioRepository();

type UsuarioInput = Record<string, unknown>;

export class UsuarioService {
    async getAll() {
        return repository.findAll();
    }

    async getById(id: number) {
        const usuario = await repository.findPublicById(id);

        if (!usuario) {
            throw new AppError('No existe un usuario con el id indicado.', 404);
        }

        return usuario;
    }

    async create(input: unknown) {
        const data = this.validateInput(input, true);
        const emailExistente = await repository.findByEmail(data.email!);

        if (emailExistente) {
            throw new AppError('Ya existe un usuario registrado con ese email.', 409);
        }

        return repository.create({
            nombre: data.nombre!,
            email: data.email!,
            contrasenia: await hashPassword(data.contrasenia!),
            rol: data.rol!
        });
    }

    async update(id: number, input: unknown) {
        const usuario = await repository.findById(id);
        if (!usuario) {
            throw new AppError('No existe un usuario con el id indicado.', 404);
        }

        const data = this.validateInput(input, false);
        if (data.email && data.email !== usuario.email.toLowerCase()) {
            const emailExistente = await repository.findByEmail(data.email);
            if (emailExistente && emailExistente.id !== id) {
                throw new AppError('Ya existe un usuario registrado con ese email.', 409);
            }
        }

        if (data.contrasenia) {
            data.contrasenia = await hashPassword(data.contrasenia);
        }

        return repository.update(id, data);
    }

    async delete(id: number) {
        const usuario = await repository.findById(id);
        if (!usuario) {
            throw new AppError('No existe un usuario con el id indicado.', 404);
        }

        const comandasAsignadas = await repository.countComandasComoMozo(id);
        if (comandasAsignadas > 0) {
            throw new AppError(
                'No se puede eliminar el usuario porque tiene comandas asociadas. Conservamos ese registro para mantener el historial.',
                409
            );
        }

        return repository.delete(id);
    }

    private validateInput(input: unknown, isCreate: boolean): Partial<{
        nombre: string;
        email: string;
        contrasenia: string;
        rol: RolUsuario;
    }> {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const hasAnyField = ['nombre', 'email', 'contrasenia', 'rol'].some((field) => field in input);
        if (!isCreate && !hasAnyField) {
            throw new AppError('Indicá al menos un campo para actualizar.');
        }

        const data: Partial<{
            nombre: string;
            email: string;
            contrasenia: string;
            rol: RolUsuario;
        }> = {};

        if (isCreate || 'nombre' in input) {
            data.nombre = requireText(input.nombre, 'nombre', 2);
        }

        if (isCreate || 'email' in input) {
            data.email = parseEmail(input.email);
        }

        if (isCreate || 'contrasenia' in input) {
            data.contrasenia = requireText(input.contrasenia, 'contrasenia', 8);
        }

        if (isCreate || 'rol' in input) {
            data.rol = parseRol(input.rol);
        }

        return data;
    }
}
