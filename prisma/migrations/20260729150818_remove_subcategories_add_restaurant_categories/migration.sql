/*
  Warnings:

  - You are about to drop the column `subcategoria_id` on the `platos` table. All the data in the column will be lost.
  - You are about to drop the `subcategorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."platos" DROP CONSTRAINT "platos_subcategoria_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subcategorias" DROP CONSTRAINT "subcategorias_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subcategorias" DROP CONSTRAINT "subcategorias_icono_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subcategorias" DROP CONSTRAINT "subcategorias_restaurante_id_fkey";

-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "platos" DROP COLUMN "subcategoria_id";

-- DropTable
DROP TABLE "public"."subcategorias";

-- CreateTable
CREATE TABLE "restaurante_categorias" (
    "restaurante_id" BIGINT NOT NULL,
    "categoria_id" BIGINT NOT NULL,

    CONSTRAINT "restaurante_categorias_pkey" PRIMARY KEY ("restaurante_id","categoria_id")
);

-- CreateIndex
CREATE INDEX "restaurante_categorias_categoria_id_idx" ON "restaurante_categorias"("categoria_id");

-- CreateIndex
CREATE INDEX "restaurante_categorias_restaurante_id_idx" ON "restaurante_categorias"("restaurante_id");

-- AddForeignKey
ALTER TABLE "restaurante_categorias" ADD CONSTRAINT "restaurante_categorias_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurante_categorias" ADD CONSTRAINT "restaurante_categorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
