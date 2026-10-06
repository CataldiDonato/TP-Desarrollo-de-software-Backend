// Test unitario: funciones de validación (src/utils/validation.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePositiveId, requireText, parseEmail, parseOpcion, TIPOS_PRODUCTO } from '../src/utils/validation';

test('parsePositiveId acepta enteros positivos (también como texto)', () => {
    assert.equal(parsePositiveId(5, 'id'), 5);
    assert.equal(parsePositiveId('12', 'id'), 12);
});

test('parsePositiveId rechaza 0, negativos, decimales y texto', () => {
    for (const valor of [0, -3, 2.5, 'abc', undefined]) {
        assert.throws(() => parsePositiveId(valor, 'id'), /número entero positivo/);
    }
});

test('requireText recorta espacios y rechaza textos vacíos', () => {
    assert.equal(requireText('  Juan  ', 'nombre'), 'Juan');
    assert.throws(() => requireText('   ', 'nombre'));
    assert.throws(() => requireText(123, 'nombre'));
});

test('parseEmail pasa a minúsculas y valida el formato', () => {
    assert.equal(parseEmail('Admin@RestoFlow.com'), 'admin@restoflow.com');
    assert.throws(() => parseEmail('no-es-un-email'));
});

test('parseOpcion solo acepta valores de la lista', () => {
    assert.equal(parseOpcion('Plato', TIPOS_PRODUCTO, 'tipo'), 'Plato');
    assert.throws(() => parseOpcion('Postre', TIPOS_PRODUCTO, 'tipo'), /Plato, Bebida/);
});
