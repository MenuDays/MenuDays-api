-- AlterTable
ALTER TABLE "promociones" ADD COLUMN "precio" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "promociones" ALTER COLUMN "precio" DROP DEFAULT;
