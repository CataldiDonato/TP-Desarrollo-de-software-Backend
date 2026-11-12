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


const app: Application = express();

// 2. Middlewares (Configuraciones iniciales)
const origenesPermitidos = process.env.CORS_ORIGIN?.split(',').map((origen) => origen.trim());
app.use(cors({ origin: origenesPermitidos ?? true })); // establece desde que orígenes puede acceder el navegado a la API (CORS)
app.use(express.json()); //interpreta el cuerpo de las peticiones que envían JSON, para que esté disponible en req.body
  
// 3. Ruta de estado (Health Check) - SIEMPRE FUNCIONA
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    estado: 'OK',
    mensaje: '🚀 Servidor Backend corriendo correctamente',
    timestamp: new Date().toISOString()
  });
});

// 4. Registro de endpoints de la API
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);   // ← acá
app.use(verificarToken);

app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/precio-producto', precioProducto);
app.use('/api/detalle-comanda', detalleComanda);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/comandas', comandasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cocina', cocinaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/medios-pago', mediosPagoRoutes);

//rutas no existentes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `La ruta '${req.originalUrl}' no existe en este servidor.`
  });
});

//Manejo de errores 

app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la solicitud no es un JSON válido.' });
  }
  console.error(error);
  return res.status(500).json({ message: 'Ocurrió un error interno al procesar la solicitud.' });
});

export default app;
