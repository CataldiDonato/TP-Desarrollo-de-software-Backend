# RestoFlow — Cobro con Mercado Pago (Checkout Pro + QR)

El mozo genera un QR en pantalla con el link de pago de la comanda. El cliente lo escanea con el celular,
paga en Mercado Pago y la comanda se cierra sola cuando MP confirma el pago.

## Cómo funciona

```
Mozo: "Cobrar con Mercado Pago (QR)"
  → POST /api/comandas/:id/mercadopago        el backend calcula el total y crea una preferencia en MP
  ← { init_point, total }                     init_point = link de pago de Checkout Pro
Frontend muestra el QR con ese link           el cliente lo escanea y paga
MP → POST /api/webhooks/mercadopago           el backend valida la firma, consulta el pago a MP
                                              y si está aprobado: comanda Pagada + mesa Libre
Frontend consulta la comanda cada 3 s         cuando ve "Pagada", cierra el modal
MP → /pago/resultado (frontend, pública)      página de "gracias" para el cliente (solo informa)
```

**Regla principal:** la comanda solo pasa a `Pagada` cuando llega el webhook y el backend confirma el
pago consultándolo a MP. Ni el frontend ni la página de retorno cierran la comanda.

## Archivos

| Archivo | Qué hace |
|---|---|
| `src/config/mercadopago.ts` | Cliente del SDK `mercadopago` (`Preference`, `Payment`) |
| `src/services/mercadopago.service.ts` | Crea la preferencia, valida la firma del webhook y procesa el pago |
| `src/routes/comanda.routes.ts` | `POST /comandas/:id/mercadopago` (A, M) |
| `src/routes/webhook.routes.ts` | `POST /webhooks/mercadopago` (público, va antes de `verificarToken` en `app.ts`) |
| `prisma/schema.prisma` | Valor `MercadoPago` en `tipo_pago` y tabla `pago_mercadopago` |
| Frontend `src/pages/Comandas/PagoQrModal.jsx` | Muestra el QR y espera el pago |
| Frontend `src/pages/Pago/ResultadoPagoPage.jsx` | Página pública `/pago/resultado` a la que vuelve el cliente |

## Reglas que aplica el backend

- **El total lo calcula el backend** con los precios vigentes de la comanda. El frontend solo manda el id.
- **El QR vence a los 30 minutos** (`expiration_date_to`).
- **Firma del webhook:** se valida el header `x-signature` (HMAC SHA256 con `MP_WEBHOOK_SECRET`). Si no
  coincide, responde `401` y no hace nada.
- **Idempotente:** si MP reenvía la notificación o la comanda ya está cerrada, no se duplica nada.
- **Monto distinto:** si el mozo agregó o quitó productos después de generar el QR, el monto pagado no
  coincide con el total y la comanda **no** se cierra sola (queda un `console.warn` en el log). Hay que
  generar un QR nuevo cada vez que cambia la comanda.
- **MercadoPago no se puede cobrar a mano:** `PATCH /comandas/:id/estado` rechaza ese medio de pago. Solo
  lo asigna el webhook. Por eso tampoco aparece en el desplegable de cobro manual.
- **Cada intento de cobro** queda registrado en `pago_mercadopago` (preferencia, id del pago, estado y monto).

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `MP_ACCESS_TOKEN` | **Access Token** de la aplicación de MP (empieza con `APP_USR-` y es largo: números, fecha, hash e id del usuario) |
| `MP_WEBHOOK_SECRET` | Clave secreta del webhook (panel de MP → la aplicación → Webhooks) |
| `PUBLIC_API_URL` | URL pública del backend, sin `/api` al final. MP no acepta `localhost` |
| `FRONTEND_URL` | URL del frontend, a donde MP devuelve al cliente después de pagar |

> **Ojo en Vercel:** cada valor va solo, sin comillas, sin espacios y **sin comentarios** (`# ...`). En el
> `.env` local un comentario al final de la línea se ignora, pero si se copia a Vercel queda como parte del
> valor y rompe la URL del webhook. Después de cambiar una variable hay que hacer **Redeploy**.

## Configuración paso a paso

### 1. Cuentas de prueba
1. En [Mercado Pago Developers](https://www.mercadopago.com.ar/developers) → **Cuentas de prueba**, crear
   dos usuarios de Argentina **desde la misma cuenta real**:
   - un **Vendedor** (es el que cobra),
   - un **Comprador**, con saldo cargado (ej: $10.000).
2. En una ventana de incógnito, iniciar sesión en Mercado Pago **con el vendedor de prueba**.
3. Con esa sesión, en Developers → **Tus integraciones** → **Crear aplicación** (Checkout Pro).
4. En la aplicación → **Credenciales de producción**, copiar el **Access Token** → `MP_ACCESS_TOKEN`.
   Aunque digan "producción", son de una cuenta de prueba: no se mueve plata real.
5. En la aplicación → **Webhooks** → configurar:
   - URL: `https://<backend>/api/webhooks/mercadopago`
   - Evento: **Pagos**
   - Copiar la **clave secreta** → `MP_WEBHOOK_SECRET`.

### 2. Base de datos
```bash
npm run db:deploy   # aplica la migración 20261106111833_mercadopago
npm run seed        # crea el medio de pago MercadoPago (no duplica nada)
```
Para la base de producción, se corre desde la máquina local apuntando a esa base (usar la conexión
**directa**, no la del pooler):
```bash
DATABASE_URL="postgresql://...produccion..." npm run db:deploy
DATABASE_URL="postgresql://...produccion..." npx prisma migrate status   # tiene que decir "up to date"
```
> Si en producción se borraron los usuarios demo, `npm run seed` los vuelve a crear con las contraseñas
> conocidas. En ese caso, crear solo el medio de pago:
> `INSERT INTO medio_de_pago (tipo) VALUES ('MercadoPago');`

### 3. Verificar el token antes de deployar
```bash
TOKEN='<access token>'
curl -s https://api.mercadopago.com/users/me -H "Authorization: Bearer $TOKEN" | grep -oE '"nickname":[^,]*' | head -1
```
Tiene que devolver el `nickname` del vendedor de prueba (`TESTUSER...`).

### 4. Deploy
Cargar las 4 variables en Vercel (Settings → Environment Variables) y hacer **Redeploy**.

## Cómo probar un pago

1. Abrir una comanda con productos → **Cobrar con Mercado Pago (QR)**.
2. Tocar **Abrir link de pago** y abrirlo en una **ventana de incógnito nueva** (no en la app de MP del
   celular, que tiene la cuenta real iniciada).
3. **Iniciar sesión con el comprador de prueba** antes de pagar.
4. Pagar con **Dinero disponible**, o con tarjeta de prueba:
   - Mastercard `5031 7557 3453 0604` — vencimiento `11/30` — CVV `123`
   - Titular: **`APRO`** (aprobado) · `OTHE` (rechazado)
   - DNI: `12345678`
5. En unos segundos el modal muestra "Pago recibido", la comanda queda `Pagada` con medio
   `MercadoPago` y la mesa `Libre`. En el navegador del cliente aparece "¡Pago aprobado!".

## Problemas conocidos

| Síntoma | Causa | Solución |
|---|---|---|
| 500 al generar el QR y en el log `MPForbiddenError: At least one policy returned UNAUTHORIZED` (403) | Se cargó la **Public Key** en vez del Access Token (la Public Key también empieza con `APP_USR-` pero es un UUID corto), o credenciales de producción de una cuenta real sin activar | Usar el **Access Token** del vendedor de prueba |
| "Una de las partes con la que intentás hacer el pago es de prueba" | Se mezcló una cuenta real con una de prueba (ej: el link se abrió en la app de MP con la cuenta real) | Abrir el link en incógnito e iniciar sesión con el comprador de prueba |
| "No pudimos procesar tu pago" sin que se cree ningún pago | Pago como invitado, sesión mezclada con el vendedor, comprador creado desde otra cuenta o datos de tarjeta mal cargados | Cerrar todas las ventanas de incógnito, iniciar sesión con un comprador de prueba con saldo y pagar con dinero disponible |
| Se paga pero la comanda no se cierra | El webhook no llega o da `401` | En los logs de Vercel buscar `/api/webhooks/mercadopago`: `401` = `MP_WEBHOOK_SECRET` de otra aplicación; sin requests = URL del webhook mal configurada en el panel o `PUBLIC_API_URL` con basura |
| Se paga, llega el webhook, pero la comanda sigue abierta | Cambiaron productos después de generar el QR | Ver el `console.warn` en el log; generar un QR nuevo |
| Error de Prisma `P2021` (tabla no existe) | Falta la migración en esa base | `npm run db:deploy` apuntando a esa base |

Ver el motivo de un pago rechazado (con el token del vendedor):
```bash
curl -s "https://api.mercadopago.com/v1/payments/search?external_reference=<id comanda>&sort=date_created&criteria=desc" \
  -H "Authorization: Bearer $TOKEN" | grep -oE '"(id|status|status_detail)":[^,]*' | head
```
Si no aparece ningún pago, MP lo cortó antes de crearlo (problema de cuentas o sesión, no del código).

## Pasar a producción (cuenta real del restaurante)

1. Con la cuenta **real** del restaurante, crear la aplicación y **activar las credenciales de producción**
   (MP pide rubro y sitio web).
2. Configurar el webhook en esa aplicación (misma URL, evento Pagos) y copiar su clave secreta.
3. Reemplazar `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET` en Vercel → Redeploy.
4. Hacer un pago real chico y devolverlo desde el panel de MP.

En producción el cliente sí puede abrir el link con la app de Mercado Pago.

> **Seguridad:** el Access Token y la clave del webhook no se suben al repo ni se comparten por chat. Si se
> filtran, regenerarlos desde el panel de MP.

## Nota: Preferences vs Orders

Esta integración usa la **API de Preferencias** (`POST /checkout/preferences`), que MP sigue soportando.
Para integraciones nuevas MP recomienda la API de **Orders**. Migrar solo cambia
`mercadopago.service.ts` y el webhook; el resto (QR, polling, página de retorno, tabla) queda igual.
