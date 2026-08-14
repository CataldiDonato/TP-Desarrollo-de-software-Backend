import { tipo_producto } from "../generated/enums";


export interface UpdateProducto {
    nombre?: string;
    descripcion?: string;
    tipo?: tipo_producto;
    id_categoria?: number;
    precio?: number;
}