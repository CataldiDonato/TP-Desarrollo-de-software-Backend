import crypto from 'node:crypto';
import prisma from '../config/db';
import { mpPreference, mpPayment } from '../config/mercadopago';
import { comandaService } from './comanda.service';
import { comandaRepository } from '../repositories/comanda.repository';
import { AppError } from '../utils/app-error';

const comandas = new comandaService();
const comandaRepo = new comandaRepository();

export class mercadopagoService {

  // 1) Crea la preferencia con el total calculado EN EL BACKEND (nunca desde el front)
  async crearPreferencia(idComanda: number) {
    const comanda = await comandas.findById(idComanda); // ya trae detalles con precio y total
    if (comanda.estado !== 'Abierta') throw new AppError('La comanda ya está cerrada.', 409);
    if (comanda.detalles.length === 0) throw new AppError('La comanda no tiene productos.');

    const pref = await mpPreference.create({
      body: {
        items: comanda.detalles.map((d) => ({
          id: String(d.id_producto),
          title: d.nombre_producto,
          quantity: d.cantidad,
          unit_price: Number(d.precio),
          currency_id: 'ARS',
        })),
        external_reference: String(comanda.id),   // así sabemos a qué comanda corresponde el pago
        notification_url: `${process.env.PUBLIC_API_URL}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago/resultado`,
          failure: `${process.env.FRONTEND_URL}/pago/resultado`,
          pending: `${process.env.FRONTEND_URL}/pago/resultado`,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // QR válido 30 min
        statement_descriptor: 'RESTOFLOW',
      },
    });

    await prisma.pago_mercadopago.create({
      data: { id_comanda: comanda.id, preference_id: pref.id!, monto: comanda.total },
    });

    return { preference_id: pref.id, init_point: pref.init_point, total: comanda.total };
  }

  // 2) Valida que el webhook venga realmente de MP (header x-signature)
  firmaValida(headers: Record<string, any>, dataId: string): boolean {
    const xSignature = headers['x-signature'];
    const xRequestId = headers['x-request-id'];
    if (!xSignature || !xRequestId || !dataId) return false;

    const partes = Object.fromEntries(
      String(xSignature).split(',').map((p) => p.trim().split('=') as [string, string])
    );
    const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${partes.ts};`;
    const esperado = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET!).update(manifest).digest('hex');

    const a = Buffer.from(esperado);
    const b = Buffer.from(partes.v1 ?? '');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  // 3) Procesa la notificación: consulta el pago REAL a MP y cierra la comanda si corresponde
  async procesarPago(paymentId: string) {
    const pago = await mpPayment.get({ id: paymentId });
    const idComanda = Number(pago.external_reference);
    if (!idComanda) return;

    // Registro idempotente: si MP reenvía la notificación, no se duplica nada
    const registro = await prisma.pago_mercadopago.findFirst({
      where: { id_comanda: idComanda },
      orderBy: { creado_en: 'desc' },
    });
    if (registro) {
      await prisma.pago_mercadopago.update({
        where: { id: registro.id },
        data: { payment_id: String(pago.id), estado: pago.status ?? 'unknown' },
      });
    }

    if (pago.status !== 'approved') return;

    const comanda = await comandas.findById(idComanda).catch(() => null);
    if (!comanda) return; // external_reference que no es nuestra: se ignora (si no, MP reintenta para siempre)
    if (comanda.estado !== 'Abierta') return; // ya estaba cerrada (reintento de MP)

    // Si el mozo agregó productos después de generar el QR, el monto no coincide: no se cierra sola
    if (Math.abs(Number(pago.transaction_amount) - comanda.total) > 0.01) {
      console.warn(`Pago ${pago.id}: monto ${pago.transaction_amount} ≠ total ${comanda.total} (comanda ${idComanda})`);
      return;
    }

    const medio = await prisma.medio_de_pago.findFirst({ where: { tipo: 'MercadoPago' } });
    await comandaRepo.cerrar(idComanda, comanda.id_mesa, 'Pagada', medio!.id);
  }
}