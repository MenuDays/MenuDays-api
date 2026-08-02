-- AlterEnum
ALTER TYPE "item_pedido_tipo" ADD VALUE 'promocion';

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "promocion_id" BIGINT;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_promocion_id_fkey" FOREIGN KEY ("promocion_id") REFERENCES "promociones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
