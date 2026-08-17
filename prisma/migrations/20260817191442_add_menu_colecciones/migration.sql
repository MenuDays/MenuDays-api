-- AlterTable
ALTER TABLE "menus_del_dia" ADD COLUMN     "coleccion_id" BIGINT;

-- CreateTable
CREATE TABLE "menu_colecciones" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_colecciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_menu_colecciones_restaurante" ON "menu_colecciones"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_colecciones_restaurante_id_nombre_key" ON "menu_colecciones"("restaurante_id", "nombre");

-- CreateIndex
CREATE INDEX "ix_menus_coleccion" ON "menus_del_dia"("coleccion_id");

-- AddForeignKey
ALTER TABLE "menus_del_dia" ADD CONSTRAINT "menus_del_dia_coleccion_id_fkey" FOREIGN KEY ("coleccion_id") REFERENCES "menu_colecciones"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_colecciones" ADD CONSTRAINT "menu_colecciones_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
