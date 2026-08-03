Acá tenés la guía completa actualizada 100% a **TypeScript (`.ts`)**, lista para copiar y pegar en tu archivo **`GUIA_DESARROLLO.md`**:

```markdown
# 🚀 Guía de Desarrollo Backend - RestoFlow (TypeScript Edition)

Documento de organización, arquitectura de software, división de tareas y flujo de trabajo en Git para el equipo de desarrollo.

---

## 👥 1. División de Tareas por Integrante

### 🟢 1. DONATO — Módulo: Menú (Productos, Categorías y Precios)
* **Pantallas asociadas:** PDF 2 (Pág 2, 5, 9 y 10: Vista de Productos, ABM Productos, ABM Categorías).
* **Modelos Prisma:** `producto`, `categoria`, `precio_producto`
* **Endpoints a desarrollar:**
  * **Categorías:**
    * `GET /api/categorias` — Listar todas las categorías con sus productos.
    * `POST /api/categorias` — Crear una nueva categoría.
    * `PUT /api/categorias/:id` / `DELETE /api/categorias/:id` — Editar y eliminar categorías.
  * **Productos:**
    * `GET /api/productos` — Listar productos (con filtro opcional por categoría o tipo `Plato`/`Bebida`).
    * `POST /api/productos` — Crear producto y registrar su precio inicial en `precio_producto`.
    * `PUT /api/productos/:id` — Actualizar datos (si cambia el precio, genera nuevo registro en `precio_producto`).
    * `DELETE /api/productos/:id` — Eliminar/desactivar producto.
  * **Precios:**
    * `GET /api/productos/:id/historial-precios` — Consultar variaciones históricas de precios.

---

### 🔵 2. GASPAR — Módulo: Salón (Mesas y Reservas)
* **Pantallas asociadas:** PDF 2 (Pág 1, 2 y 7: Listado de Reservas, Listado de Mesas, Nueva Reserva).
* **Modelos Prisma:** `mesa`, `reserva`
* **Endpoints a desarrollar:**
  * **Mesas:**
    * `GET /api/mesas` — Listar todas las mesas con su estado dinámico (`Libre`/`Ocupada`/`Reservada`).
    * `POST /api/mesas` — Crear nueva mesa con su capacidad.
    * `GET /api/mesas/disponibles` — Listar solo las mesas libres para el momento actual.
  * **Reservas:**
    * `GET /api/reservas` — Listar reservas (con buscador/filtro por fecha o cliente).
    * `POST /api/reservas` — Crear reserva vinculando mesa y cantidad de personas.
    * `PATCH /api/reservas/:id/estado` — Cambiar estado (`Confirmada`, `Cancelada`) + motivo de cancelación.
    * `PATCH /api/reservas/:id/asignar-mesa` — Asignar/cambiar mesa a una reserva.

---

### 🟡 3. TOMAS — Módulo: Comandas y Atención (Mozos / Pedidos)
* **Pantallas asociadas:** PDF 1 (Pág 2, 3 y 5), PDF 2 (Pág 3: Comandas general, Nueva Comanda, Agregar detalles).
* **Modelos Prisma:** `comanda`, `detalle_comanda` (Creación), `medio_de_pago`
* **Endpoints a desarrollar:**
  * **Comandas (Cabecera):**
    * `GET /api/comandas` — Listar comandas activas e históricas (filtro por mesa, fecha o estado).
    * `POST /api/comandas` — Abrir/crear una comanda nueva (vincula `id_mesa` e `id_mozo`).
    * `PATCH /api/comandas/:id/estado` — Cambiar estado (`Abierta`, `Pagada`, `Cancelada`) y asignar `id_medio_pago` al cobrar.
  * **Detalle de Comanda (Carga de Items):**
    * `POST /api/comandas/:id/detalles` — Agregar un producto y cantidad a la comanda.
    * `PUT /api/comandas/:id/detalles/:id_producto` — Editar la cantidad de un producto.
    * `DELETE /api/comandas/:id/detalles/:id_producto` — Quitar producto de la comanda.
  * **Medios de Pago:**
    * `GET /api/medios-de-pago` — Obtener métodos de pago disponibles (`Efectivo`, `Transferencia`, `Tarjeta`).

---

### 🔴 4. ISMAEL — Módulo: Cocina, Usuarios y Dashboard (Métricas)
* **Pantallas asociadas:** PDF 1 (Pág 1 y 4: Cocina KDS), PDF 2 (Pág 4, 6 y 8: Usuarios, Dashboard Home).
* **Modelos Prisma:** `usuario`, `detalle_comanda` (Cocina), Integración Dashboard.
* **Endpoints a desarrollar:**
  * **Gestión de Usuarios:**
    * `GET /api/usuarios` — Listar usuarios con sus roles (`Administrador`, `Mozo`, `Cocinero`).
    * `POST /api/usuarios` — Crear usuario / Registrar nuevo empleado.
    * `PUT /api/usuarios/:id` / `DELETE /api/usuarios/:id` — Editar/eliminar usuario.
  * **Pantalla de Cocina (KDS):**
    * `GET /api/cocina/pedidos` — Obtener ítems agrupados por estado (`Pendiente`, `En_Preparacion`).
    * `PATCH /api/cocina/detalles/estado` — Actualizar estado del plato (`Pendiente` ➔ `En_Preparacion` ➔ `Finalizada`) y registrar `id_cocinero`.
  * **Dashboard / Home:**
    * `GET /api/dashboard/stats` — Métricas generales (Mesas ocupadas, Ventas del día, Pedidos en cocina, Próximas reservas).

---

## 📁 2. Estructura de Carpetas del Proyecto (TypeScript)

```text
Backend/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── db.ts                      <-- Instancia centralizada de Prisma
│   ├── controllers/                   <-- Lógica de negocio de cada integrante
│   │   ├── categorias.controller.ts   (Donato)
│   │   ├── productos.controller.ts    (Donato)
│   │   ├── reservas.controller.ts      (Gaspar)
│   │   ├── mesas.controller.ts         (Gaspar)
│   │   ├── comandas.controller.ts      (Tomas)
│   │   ├── usuarios.controller.ts      (Ismael)
│   │   └── cocina.controller.ts        (Ismael)
│   ├── routes/                        <-- Definición de rutas Express en TS
│   │   ├── categorias.routes.ts       (Donato)
│   │   ├── productos.routes.ts        (Donato)
│   │   ├── reservas.routes.ts         (Gaspar)
│   │   ├── mesas.routes.ts            (Gaspar)
│   │   ├── comandas.routes.ts         (Tomas)
│   │   ├── usuarios.routes.ts         (Ismael)
│   │   └── cocina.routes.ts           (Ismael)
│   └── app.ts                         <-- Configuración principal de Express
├── .env
├── index.ts                           <-- Arranca el servidor
├── package.json
├── tsconfig.json                      <-- Configuración de TypeScript
└── prisma.config.ts
```

---

## ⚙️ 3. Instalación de Dependencias

Ejecutar en la terminal dentro de la carpeta `Backend`:

```bash
# Dependencias base
npm install express cors dotenv

# Dependencias para TypeScript y desarrollo
npm install -D typescript @types/express @types/cors @types/node ts-node-dev
```

*(Si hacés `git pull` de un proyecto donde ya se instalaron, solo ejecutá `npm install`)*.

### Script para levantar el servidor (`package.json`)
Agreguen este script en su `package.json`:
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only index.ts"
}
```
Para arrancar el servidor en desarrollo: `npm run dev`

---

## 🔄 4. Flujo de Trabajo en Git (Git Workflow)

Para evitar conflictos de fusión (**merge conflicts**), trabajaremos exclusivamente en ramas individuales.

### 1. Nombre de Ramas Asignadas:
* **Donato:** `git checkout -b feature/donato-menu`
* **Gaspar:** `git checkout -b feature/gaspar-salon`
* **Tomas:** `git checkout -b feature/tomas-comandas`
* **Ismael:** `git checkout -b feature/ismael-usuarios`

### 2. Comandos para subir trabajo:
```bash
git add .
git commit -m "feat: agrego endpoint de crear categoria"
git push origin <nombre-de-tu-rama>
```

### 3. Integración:
Al terminar una funcionalidad, abren un **Pull Request (PR)** en GitHub hacia la rama `main`.

---

## 💻 5. Paso a Paso: Ejemplo Completo de Creación de una API en TypeScript

A continuación se muestra el ejemplo de cómo crear los endpoints para el módulo de **Categorías**.

### Paso 1: Instancia de Prisma (`src/config/db.ts`)
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### Paso 2: Controlador (`src/controllers/categorias.controller.ts`)
```typescript
import { Request, Response } from 'express';
import prisma from '../config/db';

// GET /api/categorias - Listar categorías
export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { productos: true }
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// POST /api/categorias - Crear categoría
export const createCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      res.status(400).json({ error: 'El nombre es obligatorio' });
      return;
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre }
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};
```

### Paso 3: Rutas (`src/routes/categorias.routes.ts`)
```typescript
import { Router } from 'express';
import { getCategorias, createCategoria } from '../controllers/categorias.controller';

const router = Router();

router.get('/', getCategorias);
router.post('/', createCategoria);

export default router;
```

### Paso 4: Express App (`src/app.ts`)
*(Registrado desde el día 1)*
```typescript
import express, { Application } from 'express';
import cors from 'cors';

import categoriasRoutes from './routes/categorias.routes';
import mesasRoutes from './routes/mesas.routes';
import comandasRoutes from './routes/comandas.routes';
import usuariosRoutes from './routes/usuarios.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Endpoints registrados
app.use('/api/categorias', categoriasRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/comandas', comandasRoutes);
app.use('/api/usuarios', usuariosRoutes);

export default app;
```

### Paso 5: Punto de Entrada (`index.ts`)
```typescript
import app from './src/app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor TS corriendo en http://localhost:${PORT}`);
});
```

---

## 🔒 6. Reglas de Oro
1. **Nadie edita `src/app.ts` ni `index.ts` después de la configuración inicial del Día 1.**
2. **Cada integrante trabaja ÚNICAMENTE dentro de sus propios archivos `.ts`** en `src/controllers/` y `src/routes/`.
3. **NUNCA subir cambios directamente a `main`**, siempre usen sus ramas individuales.
4. Prueben sus endpoints en **Postman / Insomnia** a medida que vayan programando.
```