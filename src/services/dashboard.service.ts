import { DashboardRepository } from '../repositories/dashboard.repository';

const repository = new DashboardRepository();

export class DashboardService {
    async getStats() {
        const now = new Date();
        const inicioDelDia = new Date(now);
        inicioDelDia.setHours(0, 0, 0, 0);

        const finDelDia = new Date(inicioDelDia);
        finDelDia.setDate(finDelDia.getDate() + 1);

        const [mesasOcupadas, pedidosEnCocina, comandasPagadas, proximasReservas] = await repository.getMetricas(
            inicioDelDia,
            finDelDia,
            now
        );

        let ventasDelDia = 0;
        let itemsSinPrecioHistorico = 0;

        for (const comanda of comandasPagadas) {
            for (const detalle of comanda.detalles_comandas) {
                // El precio se obtiene de la lista vigente al momento en que se abrió la comanda.
                const precioVigente = detalle.producto.precios.find(
                    (precio) => precio.fecha_desde <= comanda.fecha
                );

                if (!precioVigente) {
                    itemsSinPrecioHistorico += detalle.cantidad;
                    continue;
                }

                ventasDelDia += Number(precioVigente.precio) * detalle.cantidad;
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
