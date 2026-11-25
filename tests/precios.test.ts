// Test unitario: precio vigente de un producto (src/utils/precios.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precioVigente } from '../src/utils/precios';

// Ordenados del más nuevo al más viejo, como los devuelve el repository
const precios = [
    { precio: '1500', fecha_desde: new Date('2026-10-05T12:00:00Z') },
    { precio: '1000', fecha_desde: new Date('2026-10-01T12:00:00Z') }
];

test('usa el último precio cargado antes de la fecha de la comanda', () => {
    assert.equal(precioVigente(precios, new Date('2026-10-03T12:00:00Z')), 1000);
    assert.equal(precioVigente(precios, new Date('2026-10-06T12:00:00Z')), 1500);
});

test('si la comanda es anterior al primer precio, usa el primer precio', () => {
    assert.equal(precioVigente(precios, new Date('2026-09-01T12:00:00Z')), 1000);
});

test('si el producto no tiene precios devuelve null', () => {
    assert.equal(precioVigente([], new Date()), null);
});
