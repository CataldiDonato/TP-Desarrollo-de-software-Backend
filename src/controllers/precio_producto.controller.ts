import { Request,Response } from "express";
import { precio_productoService } from "../services/precio_producto.service";

const service = new precio_productoService();

export class precio_productoController{

    async getUltPrecio(req: Request, res: Response){
        try {
            const {id_producto} = req.params;
            const idNumber = Number(id_producto)

            if (isNaN(idNumber)){
                return res.status(400).json({ message: "El ID del producto debe ser un número válido." });
            }

            const precioProducto = await service.getUltimoPrecio(idNumber);

            if (!precioProducto) {
                return res.status(404).json({ message: "No se encontró ningún precio para este producto." });
            }

            res.status(200).json(precioProducto);
        } catch (error:any) {
            res.status(500).json({message: error.message});
        }
    }

    async getPrecios(req: Request, res: Response){
        try {
            const {id_producto} = req.params;
            const idNumber = Number(id_producto)

            if (isNaN(idNumber)){
                return res.status(400).json({ message: "El ID del producto debe ser un número válido." });
            }

            const precioProducto = await service.getAll(idNumber);

            if (!precioProducto) {
                return res.status(404).json({ message: "No se encontró ningún precio para este producto." });
            }

            res.status(200).json(precioProducto);
        } catch (error:any) {
            res.status(500).json({message: error.message});
        }
    }
}
