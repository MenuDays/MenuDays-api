-- AlterTable: los 5 campos "componente_*" de menus_del_dia pasan de un
-- solo nombre (VARCHAR) a un array de nombres (TEXT[]) -- un mismo tipo
-- fijo (ej. Entrada) puede tener más de una opción (ej. "Ensalada" y
-- "Sopa de fideo"), que el comensal ve como checkboxes dentro de ese
-- tipo. USING envuelve cualquier valor existente en un array de 1
-- elemento en vez de perderlo.
ALTER TABLE "menus_del_dia"
  ALTER COLUMN "componente_entrada" TYPE TEXT[] USING (
    CASE WHEN "componente_entrada" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY["componente_entrada"] END
  ),
  ALTER COLUMN "componente_entrada" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "componente_sopa" TYPE TEXT[] USING (
    CASE WHEN "componente_sopa" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY["componente_sopa"] END
  ),
  ALTER COLUMN "componente_sopa" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "componente_plato_fuerte" TYPE TEXT[] USING (
    CASE WHEN "componente_plato_fuerte" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY["componente_plato_fuerte"] END
  ),
  ALTER COLUMN "componente_plato_fuerte" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "componente_jugo" TYPE TEXT[] USING (
    CASE WHEN "componente_jugo" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY["componente_jugo"] END
  ),
  ALTER COLUMN "componente_jugo" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "componente_postre" TYPE TEXT[] USING (
    CASE WHEN "componente_postre" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY["componente_postre"] END
  ),
  ALTER COLUMN "componente_postre" SET DEFAULT ARRAY[]::TEXT[];
