import prima from '../config/db.js'

// GET ALL
export const getCategorias = async (req, res) => {
    try {
        const categorias = await prisma.categorias.findMany({include: {productos: true}});
        res.json(categorias);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener categorías'});
    };
}
// POST
export const createCategoria = async (req, res) => {
    try {

    } catch {

    };
}