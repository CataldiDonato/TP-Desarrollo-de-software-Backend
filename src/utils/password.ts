import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(contraseniaPlana: string, hashGuardado: string): Promise<boolean> {
    // 1. Separamos el salt del hash que teníamos guardado
    const [salt, keyHex] = hashGuardado.split(':');

    // Validación por si el string guardado no tenía el formato correcto
    if (!salt || !keyHex) {
        return false;
    }

    // 2. Volvemos a calcular el hash con la contraseña ingresada y el mismo salt
    const derivedKey = (await scrypt(contraseniaPlana, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(keyHex, 'hex');

    // 3. Comparamos de forma segura contra ataques de tiempo (timing attacks)
    if (derivedKey.length !== keyBuffer.length) {
        return false;
    }

    return timingSafeEqual(derivedKey, keyBuffer);
}