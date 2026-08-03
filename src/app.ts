import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// 1. Importaciones de rutas de cada integrante
// (Descomenta cada una a medida que las vayan creando)
// import categoriasRoutes from './routes/categorias.routes';
// import productosRoutes from './routes/productos.routes';
// import mesasRoutes from './routes/mesas.routes';
// import reservasRoutes from './routes/reservas.routes';
// import comandasRoutes from './routes/comandas.routes';
// import usuariosRoutes from './routes/usuarios.routes';
// import cocinaRoutes from './routes/cocina.routes';

const app: Application = express();

// 2. Middlewares (Configuraciones iniciales)
app.use(cors());          // Permite que el Frontend se conecte al Backend
app.use(express.json());  // Permite a Express leer JSON en el cuerpo de las peticiones (req.body)

// 3. Ruta de estado (Health Check) - SIEMPRE FUNCIONA
// Esta ruta garantiza que http://localhost:3000/ siempre responda
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    estado: 'OK',
    mensaje: '🚀 Servidor Backend corriendo correctamente',
    timestamp: new Date().toISOString()
  });
});

// 4. Registro de endpoints de la API
// (Descomenta la línea cuando la ruta correspondiente esté lista)
// app.use('/api/categorias', categoriasRoutes);
// app.use('/api/productos', productosRoutes);
// app.use('/api/mesas', mesasRoutes);
// app.use('/api/reservas', reservasRoutes);
// app.use('/api/comandas', comandasRoutes);
// app.use('/api/usuarios', usuariosRoutes);
// app.use('/api/cocina', cocinaRoutes);

// 5. Captura de rutas no existentes (Reemplaza el texto "Cannot GET")
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta '${req.originalUrl}' no existe en este servidor.`
  });
});

export default app;