import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ReservaRepository } from '../src/repositories/reserva.repository';
import { MesaRepository } from '../src/repositories/mesa.repository';
import { ReservaService, type CreateReserva, type UpdateReserva } from '../src/services/reserva.service';
import { MesaService } from '../src/services/mesa.service';
import { parseInstanteReserva, rangoDiaReserva } from '../src/utils/fecha-reserva';

test('el día del restaurante incluye los límites correctos en UTC', () => {
    const { desde, hasta } = rangoDiaReserva('2031-05-10');
    assert.equal(desde.toISOString(), '2031-05-10T03:00:00.000Z');
    assert.equal(hasta.toISOString(), '2031-05-11T03:00:00.000Z');
    const dentro = (valor: string) => new Date(valor) >= desde && new Date(valor) < hasta;
    assert.equal(dentro('2031-05-10T02:59:59.999Z'), false);
    assert.equal(dentro('2031-05-10T03:00:00.000Z'), true);
    assert.equal(dentro('2031-05-11T02:59:59.999Z'), true);
    assert.equal(dentro('2031-05-11T03:00:00.000Z'), false);
    assert.throws(() => rangoDiaReserva('2031-02-30'));
    assert.throws(() => rangoDiaReserva('2031-05-10T00:00'));
});

test('acepta solo instantes explícitos válidos para reservas', () => {
    assert.equal(parseInstanteReserva('2031-05-11T02:30:00Z').toISOString(), '2031-05-11T02:30:00.000Z');
    assert.equal(parseInstanteReserva('2031-05-10T23:30:00-03:00').toISOString(), '2031-05-11T02:30:00.000Z');
    assert.throws(() => parseInstanteReserva('2031-05-10T23:30'));
    assert.throws(() => parseInstanteReserva('2031-02-30T23:30:00Z'));
});

test('el filtro usa el intervalo semiabierto en la consulta', async () => {
    const findMany = mock.method(ReservaRepository.prototype, 'findAll', async (_cliente?: string, desde?: Date, hasta?: Date) => {
        assert.equal(desde?.toISOString(), '2031-05-10T03:00:00.000Z');
        assert.equal(hasta?.toISOString(), '2031-05-11T03:00:00.000Z');
        return [];
    });
    try { await new ReservaService().getAll(undefined, '2031-05-10'); }
    finally { findMany.mock.restore(); }
});

test('disponibilidad, validación y guardado usan el mismo instante al crear y editar', async () => {
    const instante = '2031-05-11T02:30:00.000Z';
    const inicio = '2031-05-11T00:30:00.000Z';
    const fin = '2031-05-11T04:30:00.000Z';
    const datos = { fecha: instante, cantidad_personas: 2, id_mesa: 1, nombre_cliente: 'Ana', telefono_cliente: '123' };
    const mesa = { id: 1, capacidad: 4, estado: 'Libre' };
    const stubs = [
        mock.method(MesaRepository.prototype, 'findDisponibles', async (_cantidad: number, desde: Date, hasta: Date, excluirId?: number) => {
            assert.equal(desde.toISOString(), inicio);
            assert.equal(hasta.toISOString(), fin);
            assert.equal(excluirId, 7);
            return [mesa] as any;
        }),
        mock.method(MesaRepository.prototype, 'findById', async () => mesa as any),
        mock.method(ReservaRepository.prototype, 'findById', async () => ({ ...datos, id: 7, fecha: new Date(instante), estado: 'Confirmada' }) as any),
        mock.method(ReservaRepository.prototype, 'findSuperpuestas', async (_mesa: number, desde: Date, hasta: Date) => {
            assert.equal(desde.toISOString(), inicio);
            assert.equal(hasta.toISOString(), fin);
            return [];
        }),
        mock.method(ReservaRepository.prototype, 'create', async (data: CreateReserva) => {
            assert.equal(data.fecha.toISOString(), instante);
            return data as any;
        }),
        mock.method(ReservaRepository.prototype, 'update', async (_id: number, data: UpdateReserva) => {
            assert.equal(data.fecha?.toISOString(), instante);
            return data as any;
        }),
    ];
    try {
        await new MesaService().getDisponibles(instante, 2, 7);
        await new ReservaService().create(datos);
        await new ReservaService().update(7, datos);
    } finally { stubs.forEach(stub => stub.mock.restore()); }
});
