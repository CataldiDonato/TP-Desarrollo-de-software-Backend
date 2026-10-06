# RestoFlow — Documentación de la API

URL base: `http://localhost:3000/api`

## Autenticación

Todas las rutas (menos `POST /auth/login`) piden un token en el header:

```
Authorization: Bearer <token>
```

El token se obtiene en el login y dura 8 horas. Dentro del token van el `id` y el `rol` del usuario, y el backend usa esos datos para saber quién es el mozo que abre una comanda o el cocinero que prepara un plato.

### Respuestas de error

Todas tienen el mismo formato:

```json
{ "message": "Descripción del problema" }
```

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos o faltantes |
| 401 | Sin token, token vencido o credenciales incorrectas |
| 403 | El rol del usuario no tiene permiso para esa acción |
| 404 | El recurso no existe |
| 409 | Conflicto con el estado actual (nombre repetido, mesa ocupada, reserva superpuesta, etc.) |
| 500 | Error interno no esperado |

Roles: **A** = Administrador · **M** = Mozo · **C** = Cocinero

---

## Auth

### `POST /auth/login` — público
```json
{ "email": "admin@restoflow.com", "contrasenia": "admin1234" }
```
Respuesta `200`:
```json
{ "token": "eyJ...", "usuario": { "id": 1, "nombre": "Admin", "email": "admin@restoflow.com", "rol": "Administrador" } }
```

---

## Usuarios — A

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/usuarios` | — | Lista de usuarios (sin contraseña) |
| GET | `/usuarios/:id` | — | Un usuario |
| POST | `/usuarios` | `{ nombre, email, contrasenia, rol }` | Crea un usuario. Contraseña de 8 caracteres o más |
| PUT | `/usuarios/:id` | cualquiera de los campos | Edita. Si no se manda `contrasenia`, se conserva |
| DELETE | `/usuarios/:id` | — | Borra. No se puede si tiene comandas como mozo |

`rol`: `Administrador`, `Mozo` o `Cocinero`.

---

## Categorías

| Método | Ruta | Roles | Body |
|---|---|---|---|
| GET | `/categorias` | A, M | — |
| POST | `/categorias` | A | `{ nombre }` |
| PUT | `/categorias/:id` | A | `{ nombre }` |
| DELETE | `/categorias/:id` | A | — (no se puede si tiene productos) |

El nombre no puede repetirse (sin importar mayúsculas).

---

## Productos

| Método | Ruta | Roles | Body |
|---|---|---|---|
| GET | `/productos` | A, M | — |
| POST | `/productos` | A | `{ nombre, descripcion?, tipo, id_categoria, precio }` |
| PUT | `/productos/:id` | A | igual que POST (todos los campos) |
| DELETE | `/productos/:id` | A | — (no se puede si ya fue pedido en una comanda) |

- `tipo`: `Plato` o `Bebida`. `precio` tiene que ser mayor a 0.
- Al crear, el precio se guarda como el primer registro del historial.
- Al editar, si el precio cambió se agrega un registro nuevo al historial. El precio anterior no se pierde.

Respuesta de `GET /productos`:
```json
[{ "id": 1, "nombre": "Milanesa con papas", "descripcion": "...", "tipo": "Plato",
   "id_categoria": 1, "categoria": "Platos principales", "precio": 12000 }]
```

## Historial de precios — A, M

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/precio-producto/:id/precios` | Todos los precios del producto, del más nuevo al más viejo |
| GET | `/precio-producto/:id/precios/ultimo` | Solo el precio vigente |

---

## Mesas

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/mesas?estado=Libre` | A, M | Lista. El filtro `estado` es opcional |
| GET | `/mesas/disponibles` | A, M | Sin parámetros: mesas libres ahora |
| GET | `/mesas/disponibles?fecha=ISO&personas=N` | A, M | Mesas con lugar y sin reservas en ese horario |
| GET | `/mesas/:id` | A, M | Detalle: comanda abierta (con productos y mozo) y próximas reservas |
| POST | `/mesas` | A | `{ capacidad }` |
| PUT | `/mesas/:id` | A | `{ capacidad, estado? }` |
| DELETE | `/mesas/:id` | A | No se puede si tiene comandas o reservas |

`estado`: `Libre`, `Ocupada` o `Reservada`.
- **Ocupada** la maneja el sistema: se pone sola al abrir una comanda y vuelve a **Libre** al cobrarla o cancelarla. A mano solo se puede elegir Libre o Reservada, y nunca si la mesa tiene una comanda abierta.

---

## Reservas — A, M

| Método | Ruta | Body / Query |
|---|---|---|
| GET | `/reservas?cliente=juan&fecha=2026-10-10` | Los dos filtros son opcionales. `cliente` busca coincidencias parciales sin importar mayúsculas; `fecha` trae todo ese día |
| POST | `/reservas` | `{ fecha, cantidad_personas, id_mesa, nombre_cliente, telefono_cliente }` |
| PUT | `/reservas/:id` | Cualquiera de los campos de arriba |
| PATCH | `/reservas/:id/asignar-mesa` | `{ id_mesa }` |
| PATCH | `/reservas/:id/estado` | `{ estado: "Cancelada", motivo_cancelacion }` o `{ estado: "Confirmada" }` |
| DELETE | `/reservas/:id` | — |

Reglas:
- La fecha no puede ser pasada y la cantidad de personas no puede superar la capacidad de la mesa.
- **Una mesa no puede tener dos reservas confirmadas a menos de 2 horas una de otra** (`DURACION_RESERVA_HORAS`).
- Para cancelar, el motivo es obligatorio. Si se vuelve a confirmar, se borra el motivo y se chequea otra vez que el horario esté libre.
- Si no hay resultados, devuelve `[]` (no es un error).

---

## Comandas — A, M

| Método | Ruta | Body / Query |
|---|---|---|
| GET | `/comandas?estado=Abierta` | Filtro opcional: `Abierta`, `Pagada` o `Cancelada` |
| GET | `/comandas/:id` | — |
| POST | `/comandas` | `{ id_mesa, detalles?: [{ id_producto, cantidad }] }` |
| PATCH | `/comandas/:id/estado` | `{ estado: "Pagada", id_medio_pago }` o `{ estado: "Cancelada" }` |

- **Abrir (POST):** el mozo es el usuario logueado (sale del token). La mesa no puede tener otra comanda abierta. Se crea la comanda con sus productos en estado `Pendiente` y la mesa pasa a `Ocupada`, todo en una transacción.
- **Cerrar (PATCH):** solo se puede cerrar una comanda `Abierta`. Para cobrar (`Pagada`) hace falta un medio de pago y al menos un producto. En los dos casos la mesa vuelve a `Libre` (también en una transacción).

Respuesta de `GET /comandas/:id`:
```json
{
  "id": 3, "fecha": "2026-10-06T15:28:00.000Z", "estado": "Abierta", "id_mesa": 4,
  "mozo": { "id": 2, "nombre": "Mozo" },
  "medio_pago": null,
  "detalles": [
    { "id_producto": 1, "nombre_producto": "Milanesa con papas", "cantidad": 2,
      "estado": "En_Preparacion", "precio": 12000, "subtotal": 24000 }
  ],
  "total": 24000
}
```
El `precio` de cada producto es el que estaba vigente cuando se abrió la comanda.

## Detalle de comanda — A, M

| Método | Ruta | Body |
|---|---|---|
| POST | `/detalle-comanda` | `{ id_comanda, id_producto, cantidad }` — agrega un producto (entra como `Pendiente`) |
| PUT | `/detalle-comanda/:id_comanda/:id_producto` | `{ cantidad }` |
| DELETE | `/detalle-comanda/:id_comanda/:id_producto` | — |

- La comanda tiene que estar `Abierta`.
- Un producto aparece una sola vez por comanda. Si ya está, se modifica su cantidad.
- Solo se puede cambiar o quitar un producto que la cocina todavía no empezó (`Pendiente`).

---

## Cocina

| Método | Ruta | Roles | Body |
|---|---|---|---|
| GET | `/cocina/pedidos` | A, C | — productos `Pendiente` o `En_Preparacion` de comandas abiertas |
| PATCH | `/cocina/detalles/estado` | C | `{ id_comanda, id_producto, estado }` |

- Orden de los estados: `Pendiente` → `En_Preparacion` → `Finalizada`. No se puede saltear ninguno.
- El cocinero es el usuario logueado (sale del token). Solo el cocinero que empezó un plato lo puede finalizar.
- Si dos cocineros tocan el mismo plato al mismo tiempo, el segundo recibe un `409`.

---

## Medios de pago

| Método | Ruta | Roles | Body |
|---|---|---|---|
| GET | `/medios-pago` | A, M | — |
| POST | `/medios-pago` | A | `{ tipo }` |
| PUT | `/medios-pago/:id` | A | `{ tipo }` |
| DELETE | `/medios-pago/:id` | A | — (no se puede si ya se usó para cobrar) |

`tipo`: `Efectivo`, `Transferencia` o `Tarjeta`. No se puede cargar dos veces el mismo tipo.

---

## Dashboard — A

### `GET /dashboard/stats`
```json
{
  "generadoEn": "2026-10-06T15:30:00.000Z",
  "mesasOcupadas": 1,
  "pedidosEnCocina": 3,
  "comandasPagadas": 2,
  "ventasDelDia": 62500,
  "itemsSinPrecioHistorico": 0,
  "proximasReservas": [ { "id": 1, "fecha": "...", "nombre_cliente": "...", "telefono_cliente": "...", "mesa": { "id": 1, "capacidad": 2 } } ]
}
```
