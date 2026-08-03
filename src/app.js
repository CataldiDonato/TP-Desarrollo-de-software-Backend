// src/app.js
import express from 'express';
import cors from 'cors';

// Importan los archivos vacíos de todos
import categoriasRoutes from './routes/categorias.routes.js';
import mesasRoutes from './routes/mesas.routes.js';
import comandasRoutes from './routes/comandas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Se conectan los endpoints
app.use('/api/categorias', categoriasRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/comandas', comandasRoutes);
app.use('/api/usuarios', usuariosRoutes);

export default app;