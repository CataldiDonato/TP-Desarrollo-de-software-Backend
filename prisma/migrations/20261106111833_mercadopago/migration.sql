-- AlterEnum
ALTER TYPE "tipo_pago" ADD VALUE 'MercadoPago';

-- CreateTable
CREATE TABLE "pago_mercadopago" (
    "id" SERIAL NOT NULL,
    "id_comanda" INTEGER NOT NULL,
    "preference_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pending',
    "monto" DECIMAL(65,30) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_mercadopago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pago_mercadopago_payment_id_key" ON "pago_mercadopago"("payment_id");

-- AddForeignKey
ALTER TABLE "pago_mercadopago" ADD CONSTRAINT "pago_mercadopago_id_comanda_fkey" FOREIGN KEY ("id_comanda") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
