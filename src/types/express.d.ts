import type { RolUsuario } from '../utils/validation';

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: number;
                rol: RolUsuario;
            };
        }
    }
}

export {};