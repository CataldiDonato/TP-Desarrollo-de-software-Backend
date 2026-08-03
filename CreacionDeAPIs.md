# 🚀 Guía de Desarrollo Backend - RestoFlow (TypeScript Edition)

Documento oficial de arquitectura de software, división de módulos, estándares de TypeScript y flujo de trabajo en Git para el equipo.

---

## 👥 1. División de Módulos por Integrante

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
    * `POST /api/productos` — Crear producto y registrar precio inicial en `precio_producto`.
    * `PUT /api/productos/:id` — Actualizar datos (si cambia el precio, genera nuevo registro en `precio_producto`).
    * `DELETE /api/productos/:id` — Eliminar/desactivar producto.
  * **Precios:**
    * `GET /api/productos/:id/historial-precios` — Consultar variaciones históricas de precios.

---

### 🔵 2. GASPAR — Módulo: Salón (Mesas y Reservas)
* **Pantallas asociadas:** PDF 2 (Pág 1, 2 y 7: Listado de Reservas, Listado de Mesas, Formulario Nueva Reserva).
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

## 📁 2. Estructura de Carpetas del Proyecto

```text
Backend/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── db.ts                      <-- Instancia centralizada de PrismaClient
│   ├── controllers/                   <-- Manejo de peticiones HTTP (req, res)
│   │   ├── categorias.controller.ts   (Donato)
│   │   └── ...
│   ├── services/                      <-- Lógica de negocio (Plasmado, por ahora actúa de puente)
│   │   ├── categorias.service.ts      (Donato)
│   │   └── ...
│   ├── repositories/                  <-- Acceso a datos con Prisma
│   │   ├── categorias.repository.ts   (Donato)
│   │   └── ...
│   ├── routes/                        <-- Definición de rutas Express
│   │   ├── categorias.routes.ts       (Donato)
│   │   └── ...
│   └── app.ts                         <-- Configuración principal de Express
├── .env
├── index.ts                           <-- Punto de entrada que levanta el servidor
├── package.json
└── tsconfig.json                      <-- Configuración de TypeScript


Acá tenés un **ejemplo mínimo y directo** de cómo crear un endpoint (GET y POST) con la arquitectura en capas (Route -> Controller -> Service -> Repository).

Como acordamos, los **Services** por ahora no tendrán lógica compleja, pero los dejamos "plasmados" actuando como puente entre el Controller y el Repository.

---

### 1️⃣ El Repositorio (`src/repositories/ejemplo.repository.ts`)
Acá va EXCLUSIVAMENTE el código que interactúa con la base de datos (Prisma):

```typescript
import prisma from '../config/db';

export const obtenerEjemplos = async () => {
  // Ejemplo real: return await prisma.ejemplo.findMany();
  return [{ mensaje: "API funcionando desde el repository 🚀" }];
};

export const crearEjemplo = async (nombre: string) => {
  // Ejemplo real: return await prisma.ejemplo.create({ data: { nombre } });
  return { id: 1, nombre };
};
```

---

### 2️⃣ El Servicio (`src/services/ejemplo.service.ts`)
Acá iría la lógica de negocio. Por ahora lo dejamos plasmado y solo llama al repositorio:

```typescript
import * as EjemploRepository from '../repositories/ejemplo.repository';

export const obtenerEjemplos = async () => {
  return await EjemploRepository.obtenerEjemplos();
};

export const crearEjemplo = async (nombre: string) => {
  return await EjemploRepository.crearEjemplo(nombre);
};
```

---

### 3️⃣ El Controlador (`src/controllers/ejemplo.controller.ts`)
Acá solo recibimos la petición HTTP, validamos datos básicos y llamamos al servicio:

```typescript
import { Request, Response } from 'express';
import * as EjemploService from '../services/ejemplo.service';

// GET - Obtener información
export const getEjemplo = async (req: Request, res: Response): Promise<void> => {
  try {
    const datos = await EjemploService.obtenerEjemplos();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// POST - Crear / Recibir información
export const createEjemplo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;

    // Validacion simple
    if (!nombre) {
      res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
      return; 
    }

    const nuevoDato = await EjemploService.crearEjemplo(nombre);
    res.status(201).json({ mensaje: "Creado con éxito", dato: nuevoDato });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar los datos" });
  }
};
```

---

### 4️⃣ La Ruta (`src/routes/ejemplo.routes.ts`)
Acá relacionás las URLs con las funciones del controlador:

```typescript
import { Router } from 'express';
import { getEjemplo, createEjemplo } from '../controllers/ejemplo.controller';

const router = Router();

// Definición de las URLs
router.get('/', getEjemplo);
router.post('/', createEjemplo);

export default router;
```

---

### 💡 Puntos clave a recordar en esta arquitectura:
1. **Controller**: Solo maneja `req` y `res`. No hace consultas a la BD.
2. **Service**: Contiene las reglas del negocio. Por ahora solo puentea Controller -> Repository.
3. **Repository**: Es el ÚNICO que importa y usa `prisma`.


Acá tenés el **paso a paso exacto** para crear la estructura de carpetas y archivos iniciales. 

Al crear esta "estructura esqueleto" vacía desde el primer día en la rama `main`, **dejan todo conectado de entrada** y ningún integrante va a tener que modificar jamás `app.ts` ni `index.ts`.

---

### 📂 PASO 1: Crear la estructura de carpetas
Dentro de la carpeta `Backend/`, creá las siguientes carpetas:

* `src/`
  * `src/config/`
  * `src/controllers/`
  * `src/services/`
  * `src/repositories/`
  * `src/routes/`

---

### 📄 PASO 2: Crear la conexión a Prisma (`src/config/db.ts`)
Creá el archivo `src/config/db.ts` y pegá esto:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

---

### 📄 PASO 3: Crear los archivos de Rutas "esqueleto" (`src/routes/`)

Creá los siguientes 7 archivos dentro de la carpeta `src/routes/`. Todos llevan la misma plantilla base vacía para que Express no tire error:

#### 1. `src/routes/categorias.routes.ts` (Donato)
```typescript
import { Router } from 'express';
const router = Router();

// Donato: Agregá tus rutas acá
// router.get('/', getCategorias);

export default router;
```

#### 2. `src/routes/productos.routes.ts` (Donato)
```typescript
import { Router } from 'express';
const router = Router();

// Donato: Agregá tus rutas acá

export default router;
```

#### 3. `src/routes/mesas.routes.ts` (Gaspar)
```typescript
import { Router } from 'express';
const router = Router();

// Gaspar: Agregá tus rutas acá

export default router;
```

#### 4. `src/routes/reservas.routes.ts` (Gaspar)
```typescript
import { Router } from 'express';
const router = Router();

// Gaspar: Agregá tus rutas acá

export default router;
```

#### 5. `src/routes/comandas.routes.ts` (Tomas)
```typescript
import { Router } from 'express';
const router = Router();

// Tomas: Agregá tus rutas acá

export default router;
```

#### 6. `src/routes/usuarios.routes.ts` (Ismael)
```typescript
import { Router } from 'express';
const router = Router();

// Ismael: Agregá tus rutas acá

export default router;
```

#### 7. `src/routes/cocina.routes.ts` (Ismael)
```typescript
import { Router } from 'express';
const router = Router();

// Ismael: Agregá tus rutas acá

export default router;
```

---

### 📄 PASO 4: Conectar todo en Express (`src/app.ts`)
Creá el archivo `src/app.ts` e importá todos los archivos de rutas que creamos en el paso anterior:

```typescript
import express, { Application } from 'express';
import cors from 'cors';

// Importación de rutas de cada integrante
import categoriasRoutes from './routes/categorias.routes';
import productosRoutes from './routes/productos.routes';
import mesasRoutes from './routes/mesas.routes';
import reservasRoutes from './routes/reservas.routes';
import comandasRoutes from './routes/comandas.routes';
import usuariosRoutes from './routes/usuarios.routes';
import cocinaRoutes from './routes/cocina.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de endpoints
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/comandas', comandasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cocina', cocinaRoutes);

export default app;
```

---

### 📄 PASO 5: Crear el servidor principal (`index.ts`)
Creá (o reemplazá) tu archivo `index.ts` en la raíz de `Backend/`:

```typescript
import app from './src/app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT} 🚀`);
});
```

---

### 🚀 PASO 6: Subir la estructura base a `main`

Una vez creados todos estos archivos, ejecutás en tu terminal:

```bash
git add .
git commit -m "chore: estructura de carpetas y rutas esqueleto iniciales"
git push origin main
```

---

### 🎯 PASO 7: ¿Cómo empieza a trabajar cada uno ahora?

Cada integrante hace en su máquina:

```bash
git checkout main
git pull origin main
git checkout -b <su-rama>
```

Y a partir de ahí (por ejemplo, con sus respectivos módulos):
* **Donato** crea `categorias.repository.ts`, `categorias.service.ts`, `categorias.controller.ts` y edita `categorias.routes.ts`.
* **Gaspar** crea `mesas.repository.ts`, `mesas.service.ts`, `mesas.controller.ts` y edita `mesas.routes.ts`.
* **Tomas** crea `comandas.repository.ts`, `comandas.service.ts`, `comandas.controller.ts` y edita `comandas.routes.ts`.
* **Ismael** crea `usuarios.repository.ts`, `usuarios.service.ts`, `usuarios.controller.ts` y edita `usuarios.routes.ts`.

¡Nadie vuelve a modificar `app.ts` ni `index.ts` y **no van a tener ni un solo conflicto en Git**!