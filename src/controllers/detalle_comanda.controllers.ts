import {detalle_comandaService} from "../services/detalle_comanda.services"; //Llama a la clase detalle_comandaService para poder usar sus metodos

const service = new detalle_comandaService();

export class detalle_comandaController {

    async create(req: any, res: any) {
        try {
            const { cantidad, estado, id_comanda, id_producto, id_cocinero } = req.body;
            const detalle_comanda = await service.create(cantidad, estado, id_comanda, id_producto, id_cocinero);
            res.status(201).json(detalle_comanda);
        } catch (error: any) {
            res.status(500).json({ message: "Error al crear el detalle de la comanda", error: error.message });
        }
    }

    async update(req: any, res: any) {
        try {
            const { id_comanda, id_producto } = req.params;
            const { cantidad, estado } = req.body;
            const detalle_comanda = await service.update(Number(id_comanda), Number(id_producto), cantidad, estado);
            res.status(200).json(detalle_comanda);
        } catch (error: any) {
            res.status(500).json({ message: "Error al actualizar el detalle de la comanda", error: error.message });
        }
    }

    async delete(req: any, res: any) {
        try {
            const { id_comanda, id_producto } = req.params;
            const detalle_comanda = await service.delete(Number(id_comanda), Number(id_producto));
            res.status(200).json(detalle_comanda);
        } catch (error: any) {
            res.status(500).json({ message: "Error al eliminar el detalle de la comanda", error: error.message });
        }
    }
}
