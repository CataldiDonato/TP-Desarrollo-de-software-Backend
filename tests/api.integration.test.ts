// Test de integración: levanta la API real (Express + middlewares + base de datos) y le hace pedidos HTTP.
// Necesita la base de datos del .env levantada.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/db';

let server: Server;
let url = '';

// Token firmado con la misma clave que usa el backend, para probar los permisos por rol.
function tokenDe(rol: string) {
    return jwt.sign({ id: 999999, rol }, process.env.JWT_SECRET as string);
}

before(() => {
    server = app.listen(0); // puerto 0 = el sistema elige uno libre
    const address = server.address();
    if (address && typeof address === 'object') {
        url = `http://localhost:${address.port}`;
    }
});

after(async () => {
    server.close();
    await prisma.$disconnect();
});

test('GET / responde que el servidor está funcionando', async () => {
    const res = await fetch(`${url}/`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).estado, 'OK');
});

test('una ruta protegida sin token devuelve 401', async () => {
    const res = await fetch(`${url}/api/mesas`);
    assert.equal(res.status, 401);
});

test('el login con datos incompletos devuelve 400', async () => {
    const res = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alguien@test.com' })
    });
    assert.equal(res.status, 400);
});

test('el login con credenciales incorrectas devuelve 401', async () => {
    const res = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'no-existe@test.com', contrasenia: 'cualquiera' })
    });
    assert.equal(res.status, 401);
    assert.equal((await res.json()).message, 'Credenciales inválidas.');
});

test('un Cocinero no puede ver los usuarios (403)', async () => {
    const res = await fetch(`${url}/api/usuarios`, {
        headers: { Authorization: `Bearer ${tokenDe('Cocinero')}` }
    });
    assert.equal(res.status, 403);
});

test('un Mozo puede listar las mesas y recibe una lista', async () => {
    const res = await fetch(`${url}/api/mesas`, {
        headers: { Authorization: `Bearer ${tokenDe('Mozo')}` }
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(await res.json()));
});

test('crear una mesa con capacidad inválida devuelve 400 con un mensaje claro', async () => {
    const res = await fetch(`${url}/api/mesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenDe('Administrador')}` },
        body: JSON.stringify({ capacidad: -2 })
    });
    assert.equal(res.status, 400);
    assert.match((await res.json()).message, /capacidad/);
});
