import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('La variable DATABASE_URL es obligatoria para conectarse a la base de datos.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
