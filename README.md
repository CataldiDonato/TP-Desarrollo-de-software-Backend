# RestoFlow — Backend

API REST para la gestión interna de un restaurante: mesas, reservas, comandas, cocina y cobro.

**Tecnologías:** Node.js · TypeScript · Express 5 · Prisma 7 · PostgreSQL · JWT

## Requisitos

- Node.js 20 o superior
- PostgreSQL 14 o superior (local o en la nube)

## Instalación paso a paso

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de configuración y completarlo con los datos de tu base
cp .env.example .env

# 3. Crear las tablas en la base de datos
npx prisma migrate deploy

# 4. Generar el cliente de Prisma
npx prisma generate

# 5. (Opcional) Cargar datos de prueba: usuarios, mesas, medios de pago y productos
npm run seed

# 6. Levantar el servidor en modo desarrollo (se reinicia solo al guardar)
npm run dev
```

El servidor queda en `http://localhost:3000`. Si abrís esa dirección tiene que responder `{"estado":"OK"}`.

## Variables de entorno (`.env`)

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/restoflow` |
| `JWT_SECRET` | Clave para firmar los tokens de login | un texto largo y secreto |
| `PORT` | Puerto del servidor (opcional) | `3000` |

## Usuarios de prueba (los crea `npm run seed`)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@restoflow.com | admin1234 |
| Mozo | mozo@restoflow.com | mozo1234 |
| Cocinero | cocinero@restoflow.com | cocinero1234 |

> El seed no pisa usuarios que ya existan: si el email ya estaba cargado, conserva su contraseña.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor y lo reinicia al guardar cambios |
| `npm start` | Levanta el servidor |
| `npm run seed` | Carga datos de prueba (se puede correr varias veces) |
| `npm test` | Corre los tests automáticos (necesita la base levantada) |
| `npm run typecheck` | Revisa los tipos de TypeScript sin ejecutar nada |

## Tests

Se usa el test runner que viene con Node (`node:test`), sin librerías extra. Están en la carpeta `tests/`:

| Archivo | Tipo | Qué prueba |
|---|---|---|
| `validation.test.ts` | Unitario | Validación de ids, textos, emails y enums |
| `password.test.ts` | Unitario | Hash y verificación de contraseñas |
| `precios.test.ts` | Unitario | Cálculo del precio vigente de un producto |
| `reservas.test.ts` | Unitario | Superposición de horarios de reservas |
| `api.integration.test.ts` | Integración | La API real: login, token, permisos por rol y validaciones |

Evidencia de la última ejecución: [docs/evidencia-tests.md](docs/evidencia-tests.md).

## Arquitectura (capas)

```
Ruta (routes/)  →  Controlador (controllers/)  →  Servicio (services/)  →  Repositorio (repositories/)  →  Prisma  →  PostgreSQL
```

- **Rutas:** definen la URL, el método HTTP y qué roles pueden usarla (`verificarRol`).
- **Controladores:** leen `req` (params, query, body) y devuelven la respuesta HTTP. No tienen lógica de negocio.
- **Servicios:** validan los datos y aplican las reglas del negocio. Si algo está mal, lanzan un `AppError` con el mensaje y el código HTTP.
- **Repositorios:** son los únicos que usan Prisma para hablar con la base.

Todos los errores se responden con el mismo formato: `{ "message": "texto del error" }`.

La documentación de todos los endpoints está en [docs/API.md](docs/API.md).
