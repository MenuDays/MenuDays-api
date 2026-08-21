-- CreateEnum
CREATE TYPE "tipo_programacion_menu" AS ENUM ('hoy', 'fecha', 'semanal');

-- AlterTable
ALTER TABLE "menus_del_dia" ADD COLUMN     "componente_entrada" VARCHAR(150),
ADD COLUMN     "componente_jugo" VARCHAR(150),
ADD COLUMN     "componente_plato_fuerte" VARCHAR(150),
ADD COLUMN     "componente_postre" VARCHAR(150),
ADD COLUMN     "componente_sopa" VARCHAR(150),
ADD COLUMN     "dias_semana" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tipo_programacion" "tipo_programacion_menu" NOT NULL DEFAULT 'fecha';
