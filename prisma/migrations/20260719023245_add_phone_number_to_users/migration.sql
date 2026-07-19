/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "phoneNumber" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_phoneNumber_key" ON "usuarios"("phoneNumber");
