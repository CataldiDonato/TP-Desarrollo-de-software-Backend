import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { RolUsuario } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en el .env');
}

export function verificarToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No se envió un token de autenticación.' });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (typeof payload === 'string' || !('id' in payload) || !('rol' in payload)) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        req.usuario = { id: payload.id as number, rol: payload.rol as RolUsuario };
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}

export function verificarRol(...rolesPermitidos: RolUsuario[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'No tenés permisos para realizar esta acción.' });
        }
        next();
    };
}