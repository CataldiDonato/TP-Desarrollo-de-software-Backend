// Test unitario: hash y verificación de contraseñas (src/utils/password.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../src/utils/password';

test('el hash no guarda la contraseña en texto plano', async () => {
    const hash = await hashPassword('secreta123');
    assert.ok(!hash.includes('secreta123'));
    assert.match(hash, /^[0-9a-f]+:[0-9a-f]+$/); // formato "salt:hash"
});

test('verifyPassword acepta la contraseña correcta y rechaza una incorrecta', async () => {
    const hash = await hashPassword('secreta123');
    assert.equal(await verifyPassword('secreta123', hash), true);
    assert.equal(await verifyPassword('otra', hash), false);
});

test('dos hashes de la misma contraseña son distintos (salt aleatorio)', async () => {
    assert.notEqual(await hashPassword('igual'), await hashPassword('igual'));
});

test('verifyPassword devuelve false si el hash guardado no tiene el formato esperado', async () => {
    assert.equal(await verifyPassword('1234', '1234'), false);
});
