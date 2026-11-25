// Clave con la que se firman y verifican los tokens de login.
// Si falta en el .env el servidor no arranca, así el error aparece enseguida.
const secreto = process.env.JWT_SECRET;
if (!secreto) {
    throw new Error('Falta configurar JWT_SECRET en el .env');
}

export const JWT_SECRET: string = secreto;
