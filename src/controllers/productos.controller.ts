import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { tipo_producto } from '../generated/enums';
import { UpdateProducto } from '../types/productos.types'

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
            const {nombre, descripcion, precio, tipo, idCategoria} = req.body;
            const precioNumber = Number(precio)
            const idCategoriaNumber = Number(idCategoria)
            if (!tipo || !Object.values(tipo_producto).includes(tipo)) {
                return res.status(400).json({message: `El tipo no es válido. Las opciones permitidas son: ${Object.values(tipo_producto).join(', ')}` });
            }
            if (isNaN(precioNumber)){
                return res.status(400).json({ message: "El precio del producto debe ser un numero valido." });
            }
            if (isNaN(idCategoriaNumber)){
                return res.status(400).json({ message: "El ID de la categoria debe ser un número válido." });
            }
            if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
                return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
            }
            if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
                return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
            }

            const datos: UpdateProducto = {
                nombre : nombre.trim(),
                descripcion : descripcion.trim(),
                tipo: tipo,
                precio: precioNumber,
                id_categoria:idCategoriaNumber
            }
            const nuevoProducto = await service.create(datos);
            res.status(201).json(nuevoProducto);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async deleteProducto(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const idNumber = Number(id)

            if (isNaN(idNumber)){
                return res.status(400).json({ message: "El ID del producto debe ser un número válido." });
            }

            await service.delete(idNumber);
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    async updateProducto(req: Request, res: Response) {
    try {
        const { id } = req.params; 
        const { nombre, descripcion } = req.body; 
        const idNumber = Number(id)

        if (isNaN(idNumber)){
            return res.status(400).json({ message: "El ID del producto debe ser un número válido." });
        }

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
                return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
            }

        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
            return res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto válido." });
        }

        const datos: UpdateProducto = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim()
        };

        const productoActualizado = await service.update(idNumber, datos);
        res.status(200).json(productoActualizado); 
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
}
        