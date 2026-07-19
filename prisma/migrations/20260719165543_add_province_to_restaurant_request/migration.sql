/*
  Warnings:

  - Added the required column `provincia_id` to the `solicitudes_restaurante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "solicitudes_restaurante" ADD COLUMN     "provincia_id" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "ix_solicitudes_provincia" ON "solicitudes_restaurante"("provincia_id");

-- AddForeignKey
ALTER TABLE "solicitudes_restaurante" ADD CONSTRAINT "solicitudes_restaurante_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
