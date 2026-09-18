import { Request, Response } from "express";
import { ReservaService } from "../services/reserva.service";
import {estado_reserva} from "../generated/enums";


const service = new ReservaService();

export class ReservaController {



    /*
    async getReservas(req: Request, res: Response) {
        try {
            const reservas = await service.getAll();
            res.status(200).json(reservas);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }

    }

    async getReservaByNombreCliente(req: Request, res: Response) {
        try {
            const {nombre} = req.params;
            const reserva = await service.getByNombreCliente(nombre as string);
            res.status(200).json(reserva);
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }

    */
   async getReservas(req: Request, res: Response) {
        try {
            // Capturamos los filtros que puedan venir en la URL
            const { cliente, fecha } = req.query;

            let reservas;

            //en el caso que se mande el filtro de cliente
            if (cliente) {
                reservas = await service.getByNombreCliente(cliente as string);
            } 


            //en el caso que se mande el filtro de fecha
            else if (fecha) {
                reservas = await service.getByFecha(new Date(fecha as string));
            } 
            
            
            //si no se mandaron filtros, traemos todas las reservas
            else {
                reservas = await service.getAll();
            }

            res.status(200).json(reservas);

        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }



    async createReserva(req: Request, res: Response) {
        try {
            const {fecha, cantidad_personas, id_mesa, nombre_cliente, telefono_cliente} = req.body;
            
            //armamos el objeto que exige el DTO y parseamos la fecha que llega como texto en el req.body

            const datosCreacion = {
                fecha: new Date(fecha),
                cantidad_personas,
                id_mesa,
                nombre_cliente,
                telefono_cliente
            };


            const reserva = await service.create(datosCreacion);

            res.status(201).json(reserva);

        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }


    async updateReserva(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {fecha, cantidad_personas, id_mesa, nombre_cliente, telefono_cliente, estado, motivo_cancelacion} = req.body;
            
            
            const datosActualizacion = {
                fecha: fecha ? new Date(fecha) : undefined, // (esto es un if d una sola linea) Si fecha existe, lo parseamos a Date, sino dejamos undefined para que no se actualice
                cantidad_personas,
                id_mesa,
                nombre_cliente,
                telefono_cliente,
                estado,
                motivo_cancelacion
            };

            const reserva = await service.update(Number(id), datosActualizacion);

            res.status(200).json(reserva);

        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }


    async updateEstado(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {estado, motivo_cancelacion} = req.body;

            const reserva = await service.updateEstado(Number(id), estado as estado_reserva, motivo_cancelacion);

            res.status(200).json(reserva);

        } catch (error:any) {
            res.status(400).json({message: error.message});
        }
    }


    async deleteReserva(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await service.delete(Number(id));
            res.status(200).json({ message: 'Reserva eliminada correctamente' });
        } catch (error:any) {
            res.status(400).json({message: error.message});
        }

    }

}