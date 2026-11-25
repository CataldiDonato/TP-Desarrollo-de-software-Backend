// Test unitario: rango de horario que ocupa una reserva (src/services/mesa.service.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangoDeReserva, DURACION_RESERVA_HORAS } from '../src/services/mesa.service';

test('el rango va DURACION_RESERVA_HORAS antes y después de la reserva', () => {
    const fecha = new Date('2026-10-10T21:00:00Z');
    const { desde, hasta } = rangoDeReserva(fecha);
    const horas = DURACION_RESERVA_HORAS * 60 * 60 * 1000;

    assert.equal(desde.getTime(), fecha.getTime() - horas);
    assert.equal(hasta.getTime(), fecha.getTime() + horas);
});

test('una reserva 1 hora después cae dentro del rango (se pisan)', () => {
    const { desde, hasta } = rangoDeReserva(new Date('2026-10-10T21:00:00Z'));
    const otra = new Date('2026-10-10T22:00:00Z');
    assert.ok(otra > desde && otra < hasta);
});

test('una reserva 3 horas después queda fuera del rango (no se pisan)', () => {
    const { desde, hasta } = rangoDeReserva(new Date('2026-10-10T21:00:00Z'));
    const otra = new Date('2026-10-11T00:00:00Z');
    assert.ok(!(otra > desde && otra < hasta));
});
