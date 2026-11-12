/// <reference path="../types/express.d.ts" />
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { RolUsuario } from '../utils/validation';
import { JWT_SECRET } from '../config/jwt';

// verificarToken: Comprueba que llegue un token, verifica su validez y, si es correcto, agrega los datos del usuario a la petición
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
        // La idea de next es que pase al siguiente middleware o ruta, si todo salió bien. Si el token falta o es inválido, responde con un error y no deja continuar por el camino normal.
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}
// verificarRol usa los datos que dejó el middleware verificarToken en req.usuario
export function verificarRol(...rolesPermitidos: RolUsuario[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'No tenés permisos para realizar esta acción.' });
        }
        next();
    };
}