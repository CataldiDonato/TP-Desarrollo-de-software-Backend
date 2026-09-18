import {ReservaRepository} from '../repositories/reserva.repository';
import {MesaRepository} from '../repositories/mesa.repository';
import type {estado_reserva} from '../generated/enums';


//dto para crear
export interface CreateReserva {
    fecha: Date;
    cantidad_personas: number;
    id_mesa: number;
    nombre_cliente: string;
    telefono_cliente: string;
}


// dto para actualizar
export interface UpdateReserva {
    fecha?: Date;
    cantidad_personas?: number;
    id_mesa?: number;
    nombre_cliente?: string;
    telefono_cliente?: string;
    estado?: estado_reserva;
    motivo_cancelacion?: string;

}


const repository_reserva = new ReservaRepository();
const repository_mesa = new MesaRepository();

export class ReservaService {

    async getAll() {
        return await repository_reserva.findAll();
    }

    async create(datos: CreateReserva) {

        const mesa = await repository_mesa.findById(datos.id_mesa);

        if (!mesa) {
            throw new Error(`No existe una mesa con el id: "${datos.id_mesa}".`);
        }

        if (mesa.estado === 'Ocupada') {
            throw new Error(`La mesa con el id: "${datos.id_mesa}" está ocupada.`);
        }

        if (datos.cantidad_personas > mesa.capacidad) {
            throw new Error(`La cantidad de personas excede la capacidad de la mesa con el id: "${datos.id_mesa}".`);
        }


        if (datos.cantidad_personas <= 0) {
            throw new Error(`La cantidad de personas debe ser mayor a cero.`);
        }


        return await repository_reserva.create(datos.fecha, datos.cantidad_personas, datos.id_mesa, datos.nombre_cliente, datos.telefono_cliente);

    }


    async getByNombreCliente(nombre: string) {
        const reservas = await repository_reserva.findByCliente(nombre);
        
        // Si el arreglo viene con 0 elementos, error
        if (reservas.length === 0) {
            throw new Error(`No existe ninguna reserva con el nombre de cliente: "${nombre}".`);
        }
        return reservas;    
    }


    async getByFecha(fecha: Date) { 

        const reservas = await repository_reserva.findByFecha(fecha);

        if (reservas.length === 0) {
            throw new Error(`No existe ninguna reserva con la fecha: "${fecha.toISOString().split('T')[0]}".`);
        }

        return reservas;
    
    }




    async update(id: number, datos: UpdateReserva) {
        const reserva = await repository_reserva.findById(id);
        
        if (!reserva) {
            throw new Error(`No existe una reserva con el id: "${id}".`);
        }
        
        if (datos.cantidad_personas !== undefined && datos.cantidad_personas <= 0) {
            throw new Error(`La cantidad de personas no puede ser negativa.`);
        }


        

        if (datos.id_mesa) {
            const mesa = await repository_mesa.findById(datos.id_mesa);

            if (!mesa) {
                throw new Error(`No existe una mesa con el id: "${datos.id_mesa}".`);
            }

            if (mesa.estado === 'Ocupada') {
                throw new Error(`La mesa con el id: "${datos.id_mesa}" está ocupada, no podrá cambiarse a la misma.`);
            }

            // Usamos datos.cantidad_personas si lo mandaron, o la cantidad vieja si no lo mandaron
            const cantidadAchequear = datos.cantidad_personas || reserva.cantidad_personas;
            if (cantidadAchequear > mesa.capacidad) {
                throw new Error(`La cantidad de personas excede la capacidad de la mesa con el id: "${datos.id_mesa}".`);
            }


             /*
            if (datos.id_mesa && datos.cantidad_personas) {
                const mesa = await repository_mesa.findById(datos.id_mesa);
                if (datos.cantidad_personas > mesa.capacidad) {
                    throw new Error(`La cantidad de personas excede la capacidad de la mesa con el id: "${datos.id_mesa}".`);
                }
            }
            */
        }



        //Mantenemos los datos viejos si no nos mandan los nuevos, esto evita que se borren algunos campos del registro
        // en la base de datos en el caso que no lleguen todos los campos en el request body.

        //El operador || devuelve el primer valor que no sea null o undefined, por lo que si datos.fecha es undefined, 
        // se usará reserva.fecha, y así con todos los demás campos.
        return await repository_reserva.update(
            id, 
            datos.fecha || reserva.fecha, 
            datos.cantidad_personas || reserva.cantidad_personas, 
            datos.id_mesa || reserva.id_mesa, 
            datos.nombre_cliente || reserva.nombre_cliente, 
            datos.telefono_cliente || reserva.telefono_cliente, 
            datos.estado || reserva.estado, 
            datos.motivo_cancelacion || reserva.motivo_cancelacion || undefined
        );        

    }




    async updateEstado(id: number, estado: estado_reserva, motivo_cancelacion?: string) {
        //Validamos que la reserva exista
        const reserva = await repository_reserva.findById(id); 
        if (!reserva) {
            throw new Error(`No existe una reserva con el id: "${id}".`);
        }

        //En el caso que el estado sea "Cancelada", validamos que se haya enviado el motivo de cancelación
        if (estado === 'Cancelada' && !motivo_cancelacion) {
            throw new Error(`Para cancelar una reserva es obligatorio enviar el motivo de cancelación.`);
        }

       
        return await repository_reserva.updateEstado(id, estado, motivo_cancelacion);
    }


    

    async delete(id: number) {
        const reserva = await repository_reserva.findById(id); 

        if (!reserva) {
            throw new Error(`No existe una reserva con el id: "${id}".`);
        }

        return await repository_reserva.delete(id);
    }



}
