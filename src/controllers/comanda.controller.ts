import { Request, Response } from "express"; // Importa los tipos Request y Response de Express para tipar los parámetros de las funciones del controlador
import {comandaService} from "../services/comanda.service"; //Llama a la clase comandaService para poder usar sus metodos

const service = new comandaService();

export class comandaController {

    async findAll(req: Request, res: Response) { // Aplica los tipos Request y Response a los parámetros de la función, si no estuviera importados da error
        try {
            const comandas = await service.findAll();
            res.status(200).json(comandas);
        } catch (error: any) {
            res.status(500).json({ message: "Error al obtener las comandas", error: error.message });
        }
    }
    

    async create(req: Request, res: Response) {
        try {
            const { id_mesa, id_mozo } = req.body;
            const comanda = await service.create(id_mesa, id_mozo);
            res.status(201).json(comanda);
        } catch (error: any) {
            res.status(500).json({ message: "Error al crear la comanda", error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado, id_medio_pago } = req.body;
            const comanda = await service.update(Number(id), estado, id_medio_pago);
            res.status(200).json(comanda);
        } catch (error: any) {
            res.status(500).json({ message: "Error al actualizar la comanda", error: error.message });
        }
    }
}