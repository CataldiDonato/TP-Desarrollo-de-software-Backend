/*
  Warnings:

  - Added the required column `rol` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('Administrador', 'Mozo', 'Cocinero');

-- CreateEnum
CREATE TYPE "tipo_pago" AS ENUM ('Efectivo', 'Transferencia', 'Tarjeta');

-- CreateEnum
CREATE TYPE "estado_reserva" AS ENUM ('Confirmada', 'Cancelada');

-- CreateEnum
CREATE TYPE "estado_comanda" AS ENUM ('Abierta', 'Pagada', 'Cancelada');

-- CreateEnum
CREATE TYPE "tipo_producto" AS ENUM ('Plato', 'Bebida');

-- CreateEnum
CREATE TYPE "estado_detalle_comanda" AS ENUM ('Pendiente', 'En_Preparacion', 'Finalizada');

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "rol" "rol_usuario" NOT NULL;

-- CreateTable
CREATE TABLE "medio_de_pago" (
    "id" SERIAL NOT NULL,
    "tipo" "tipo_pago" NOT NULL,

    CONSTRAINT "medio_de_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nombre_cliente" TEXT NOT NULL,
    "telefono_cliente" TEXT NOT NULL,
    "estado" "estado_reserva" NOT NULL,
    "motivo_cancelacion" TEXT,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa" (
    "id" SERIAL NOT NULL,
    "capacidad" INTEGER NOT NULL,

    CONSTRAINT "mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comanda" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "estado_comanda" NOT NULL DEFAULT 'Abierta',
    "id_mesa" INTEGER NOT NULL,
    "id_mozo" INTEGER NOT NULL,
    "id_medio_pago" INTEGER,

    CONSTRAINT "comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "tipo_producto" NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precio_producto" (
    "fecha_desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precio" DECIMAL(65,30) NOT NULL,
    "id_producto" INTEGER NOT NULL,

    CONSTRAINT "precio_producto_pkey" PRIMARY KEY ("id_producto","fecha_desde")
);

-- CreateTable
CREATE TABLE "detalle_comanda" (
    "cantidad" INTEGER NOT NULL,
    "estado" "estado_detalle_comanda" NOT NULL,
    "id_cocinero" INTEGER,
    "id_comanda" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,

    CONSTRAINT "detalle_comanda_pkey" PRIMARY KEY ("id_comanda","id_producto")
);

-- CreateTable
CREATE TABLE "_mesaToreserva" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_mesaToreserva_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_mesaToreserva_B_index" ON "_mesaToreserva"("B");

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_id_mozo_fkey" FOREIGN KEY ("id_mozo") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_id_medio_pago_fkey" FOREIGN KEY ("id_medio_pago") REFERENCES "medio_de_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio_producto" ADD CONSTRAINT "precio_producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_id_cocinero_fkey" FOREIGN KEY ("id_cocinero") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_id_comanda_fkey" FOREIGN KEY ("id_comanda") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mesaToreserva" ADD CONSTRAINT "_mesaToreserva_A_fkey" FOREIGN KEY ("A") REFERENCES "mesa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mesaToreserva" ADD CONSTRAINT "_mesaToreserva_B_fkey" FOREIGN KEY ("B") REFERENCES "reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;
