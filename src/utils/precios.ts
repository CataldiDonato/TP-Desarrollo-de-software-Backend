// Precio de un producto en una fecha dada.
// "precios" tiene que venir ordenado del más nuevo al más viejo (orderBy fecha_desde: 'desc').
// Se usa el último precio cargado antes de esa fecha. Si el producto se creó después
// (no hay precio anterior), se usa el primer precio que tuvo.
export function precioVigente(precios: { precio: unknown; fecha_desde: Date }[], fecha: Date): number | null {
    if (precios.length === 0) {
        return null;
    }

    const vigente = precios.find((precio) => precio.fecha_desde <= fecha) ?? precios[precios.length - 1];
    return Number(vigente.precio);
}
