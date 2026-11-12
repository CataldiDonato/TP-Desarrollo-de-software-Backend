export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function getErrorResponse(error: unknown) {
    if (error instanceof AppError) {
        return { statusCode: error.statusCode, message: error.message };
    }

    console.error(error);
    return {
        statusCode: 500,
        message: 'Ocurrió un error interno al procesar la solicitud.'
    };
}
// este documento genera una clase de error personalizada llamada AppError que extiende la clase Error nativa de JavaScript. Esta clase permite especificar un mensaje de error y un código de estado HTTP (por defecto 400). Además, se proporciona una función getErrorResponse que toma un error como entrada y devuelve un objeto con el código de estado y el mensaje correspondiente. Si el error es una instancia de AppError, se devuelve su código de estado y mensaje; de lo contrario, se registra el error en la consola y se devuelve un mensaje genérico de error interno con un código de estado 500.