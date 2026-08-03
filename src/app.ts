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