-- AlterTable
ALTER TABLE "menus_del_dia" ADD COLUMN     "categoria_id" BIGINT;

-- AlterTable
ALTER TABLE "promociones" ADD COLUMN     "categoria_id" BIGINT;

-- CreateIndex
CREATE INDEX "ix_menus_categoria" ON "menus_del_dia"("categoria_id");

-- AddForeignKey
ALTER TABLE "menus_del_dia" ADD CONSTRAINT "menus_del_dia_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
