import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Importante para que el Frontend pueda consultar al Backend
app.use(express.json()); // Para que el backend entienda cuando le mandan un JSON

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('El backend está funcionando con TypeScript 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});