import type { RolUsuario } from '../utils/validation';
// Que hace este archivo: Exŕess ya tiene su objeto Request, que representa la petición. Pero el middleware de restoFlow le agrega un dato propio: req.usuario
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