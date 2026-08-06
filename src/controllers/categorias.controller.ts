import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';

const service = new CategoriaService();

export class CategoriaController {

    async getCategorias(req: Request, res: Response) {
        try {
            const categorias = await service.getAll();
            res.status(200).json(categorias);
        } catch (error:any) {
            res.status(500).json({message: error.message});
        }
    }

    async createCategoria(req: Request, res: Response) {
        try {
            const {nombre} = req.body;

            if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
                return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
            }

            const nombreFinal = nombre.trim();

            const nuevaCategoria = await service.create(nombreFinal)
            res.status(201).json(nuevaCategoria);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async deleteCategoria(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const idNumber = Number(id)

            if (isNaN(idNumber)){
                return res.status(400).json({ message: "El ID de la categoria debe ser un número válido." });
            }

            await service.delete(idNumber);

            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async updateCategoria(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const { nombre } = req.body; 
            const idNumber = Number(id)
            const nombreString = String(nombre);

            if (!nombreString || typeof nombreString !== 'string' || nombreString.trim().length === 0) {
                return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
            }
            if (isNaN(idNumber)){
                return res.status(400).json({ message: "El ID de la categoria debe ser un número válido." });
            }
            const nombrefinal = nombre.trim();

            const CategoriaActualizada = await service.update(idNumber, nombrefinal);
            res.status(200).json(CategoriaActualizada); 
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
        