import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { verifyPassword } from '../utils/password';
import { AppError } from '../utils/app-error';
import { isPlainObject, requireText } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en el .env');
}

const repository = new UsuarioRepository();

export class AuthService {
    async login(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const email = requireText(input.email, 'email');
        const contrasenia = requireText(input.contrasenia, 'contrasenia');

        const usuario = await repository.findByEmail(email);

        if (!usuario) {
            throw new AppError('Credenciales inválidas.', 401);
        }

        const passwordValida = await verifyPassword(contrasenia, usuario.contrasenia);

        if (!passwordValida) {
            throw new AppError('Credenciales inválidas.', 401);
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        };
    }
}