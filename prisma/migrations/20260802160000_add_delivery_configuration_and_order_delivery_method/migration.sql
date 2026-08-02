CREATE TYPE "metodo_entrega" AS ENUM ('DELIVERY', 'RETIRO_EN_LOCAL');

ALTER TABLE "restaurantes"
  ADD COLUMN "ofrece_delivery" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "nombre_delivery" VARCHAR(150);

ALTER TABLE "pedidos"
  ADD COLUMN "metodo_entrega" "metodo_entrega" NOT NULL DEFAULT 'RETIRO_EN_LOCAL';
