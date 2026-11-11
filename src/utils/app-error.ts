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
