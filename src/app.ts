import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';


// 1. Importaciones de rutas de cada integrante
import categoriasRoutes from './routes/categorias.routes';
import productosRoutes from './routes/productos.routes';
import precioProducto from './routes/precio_producto.routes';
import detalleComanda from './routes/detalle_comanda.routes';
import mesasRoutes from './routes/mesa.routes';
import reservasRoutes from './routes/reserva.routes';
import comandasRoutes from './routes/comanda.routes';
import usuariosRoutes from './routes/usuarios.routes';
import cocinaRoutes from './routes/cocina.routes';
import dashboardRoutes from './routes/dashboard.routes';
import mediosPagoRoutes from './routes/medio_pago.routes';
import authRoutes from './routes/auth.routes';
import webhookRoutes from './routes/webhook.routes';
import { verificarToken } from './middlewares/auth.middleware';
import { AppError } from './utils/app-error';


const app: Application = express();

// 2. Middlewares (Configuraciones iniciales)
const origenesPermitidos = process.env.CORS_ORIGIN?.split(',').map((origen) => origen.trim());
app.use(cors({ origin: origenesPermitidos ?? true }));
app.use(express.json()); 
  
// 3. Ruta de estado (Health Check) - SIEMPRE FUNCIONA
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    estado: 'OK',
    mensaje: '🚀 Servidor Backend corriendo correctamente',
    timestamp: new Date().toISOString()
  });
});

// 4. Registro de endpoints de la API
// Rutas públicas: login y webhook de Mercado Pago (este último valida su propia firma).
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);

// Rutas protegidas: verificarToken se aplica por ruta y no a nivel aplicación, así una ruta que
// no existe llega al manejador de 404 en lugar de cortarse con un 401.
app.use('/api/categorias', verificarToken, categoriasRoutes);
app.use('/api/productos', verificarToken, productosRoutes);
app.use('/api/precio-producto', verificarToken, precioProducto);
app.use('/api/detalle-comanda', verificarToken, detalleComanda);
app.use('/api/mesas', verificarToken, mesasRoutes);
app.use('/api/reservas', verificarToken, reservasRoutes);
app.use('/api/comandas', verificarToken, comandasRoutes);
app.use('/api/usuarios', verificarToken, usuariosRoutes);
app.use('/api/cocina', verificarToken, cocinaRoutes);
app.use('/api/dashboard', verificarToken, dashboardRoutes);
app.use('/api/medios-pago', verificarToken, mediosPagoRoutes);

// Rutas no existentes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `La ruta '${req.originalUrl}' no existe en este servidor.`
  });
});

// 5. Manejo de errores no controlados.
// Express reconoce que es un manejador de errores porque recibe 4 parámetros.
// Respeta el código HTTP que trae el error (401, 403, 404, 409, etc.) y solo responde 500
// cuando el error es realmente inesperado.
app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  // JSON mal escrito en el body
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la solicitud no es un JSON válido.' });
  }

  // Errores propios de la aplicación (AppError) con su código y mensaje
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  // Errores de Express / body-parser que ya traen un código 4xx (ej: 413 body demasiado grande)
  const status = error?.status ?? error?.statusCode;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return res.status(status).json({ message: error.expose && error.message ? error.message : 'La solicitud no es válida.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Ocurrió un error interno al procesar la solicitud.' });
});

export default app;
