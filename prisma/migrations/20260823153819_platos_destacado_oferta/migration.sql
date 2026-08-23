-- AlterTable
ALTER TABLE "platos" ADD COLUMN     "destacado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "en_oferta" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "precio_oferta" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "ix_platos_destacado" ON "platos"("destacado");

-- CreateIndex
CREATE INDEX "ix_platos_en_oferta" ON "platos"("en_oferta");
