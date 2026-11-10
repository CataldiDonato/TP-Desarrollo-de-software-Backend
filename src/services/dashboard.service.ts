import { DateTime } from 'luxon';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { precioVigente } from '../utils/precios';
import { ZONA_RESTAURANTE } from '../utils/fecha-reserva';

const repository = new DashboardRepository();

export class DashboardService {
    async getStats() {
        const now = new Date();
        // "Hoy" es el día de Argentina, no el del servidor (en Vercel el servidor está en UTC).
        const hoy = DateTime.fromJSDate(now).setZone(ZONA_RESTAURANTE).startOf('day');
        const inicioDelDia = hoy.toJSDate();
        const finDelDia = hoy.plus({ days: 1 }).toJSDate();

        const [mesasOcupadas, pedidosEnCocina, comandasPagadas, proximasReservas] = await repository.getMetricas(
            inicioDelDia,
            finDelDia,
            now
        );

        let ventasDelDia = 0;
        let itemsSinPrecioHistorico = 0;

        for (const comanda of comandasPagadas) {
            for (const detalle of comanda.detalles_comandas) {
                // El precio se obtiene de la lista vigente al momento en que se abrió la comanda
                // (misma regla que usa el total de cada comanda).
                const precio = precioVigente(detalle.producto.precios, comanda.fecha);

                if (precio === null) {
                    itemsSinPrecioHistorico += detalle.cantidad;
                    continue;
                }

                ventasDelDia += precio * detalle.cantidad;
            }
        }

        return {
            generadoEn: now.toISOString(),
            mesasOcupadas,
            pedidosEnCocina,
            comandasPagadas: comandasPagadas.length,
            ventasDelDia: Number(ventasDelDia.toFixed(2)),
            itemsSinPrecioHistorico,
            proximasReservas
        };
    }
}
