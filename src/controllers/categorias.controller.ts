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
            const nuevaCategoria = await service.create(String(nombre))
            res.status(201).json(nuevaCategoria);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async deleteCategoria(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await service.delete(Number(id));
            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async updateCategoria(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const { nombre } = req.body; 
            const CategoriaActualizada = await service.update(Number(id), String(nombre));
            res.status(200).json(CategoriaActualizada); 
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
        