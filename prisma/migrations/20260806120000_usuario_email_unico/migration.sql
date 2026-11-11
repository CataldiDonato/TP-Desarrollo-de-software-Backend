-- El email identifica de forma única a cada empleado.
-- Antes de aplicar esta migración, corregí posibles filas duplicadas si las hubiera.
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
