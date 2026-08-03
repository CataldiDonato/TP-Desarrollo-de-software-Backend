import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';

const service = new ProductoService();

export class ProductoController {

    async getProductos(req: Request, res: Response) {
        try {
            const productos = await service.getAll();
            res.status(200).json(productos);
        } catch (error:any) {
            res.status(500).json({message: error.message});
        }
    }

    async createProducto(req: Request, res: Response) {
        try {
            const {nombre, descripcion} = req.body;
            const nuevoProducto = await service.create(String(nombre), String(descripcion))
            res.status(201).json(nuevoProducto);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async deleteProducto(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await service.delete(Number(id));
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async updateProducto(req: Request, res: Response) {
    try {
        const { id } = req.params; 
        const { nombre, descripcion } = req.body; 
        const productoActualizado = await service.update(Number(id), String(nombre), String(descripcion));
        res.status(200).json(productoActualizado); 
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
}
        