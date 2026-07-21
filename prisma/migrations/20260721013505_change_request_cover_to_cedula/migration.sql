/*
  Warnings:

  - You are about to drop the column `portada_url` on the `solicitudes_restaurante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "solicitudes_restaurante" DROP COLUMN "portada_url",
ADD COLUMN     "cedula_dorsal_url" TEXT,
ADD COLUMN     "cedula_frontal_url" TEXT;
