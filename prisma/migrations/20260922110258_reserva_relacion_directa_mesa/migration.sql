/*
  Warnings:

  - You are about to drop the `_mesaToreserva` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cantidad_personas` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_mesa` to the `reserva` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "estado_mesa" AS ENUM ('Libre', 'Ocupada', 'Reservada');

-- DropForeignKey
ALTER TABLE "_mesaToreserva" DROP CONSTRAINT "_mesaToreserva_A_fkey";

-- DropForeignKey
ALTER TABLE "_mesaToreserva" DROP CONSTRAINT "_mesaToreserva_B_fkey";

-- AlterTable
ALTER TABLE "mesa" ADD COLUMN     "estado" "estado_mesa" NOT NULL DEFAULT 'Libre';

-- AlterTable
ALTER TABLE "reserva" ADD COLUMN     "cantidad_personas" INTEGER NOT NULL,
ADD COLUMN     "id_mesa" INTEGER NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'Confirmada';

-- DropTable
DROP TABLE "_mesaToreserva";

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
