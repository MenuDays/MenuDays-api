-- Evita que un cantón/ciudad pueda existir más de una vez dentro de la misma provincia.
-- Antes de esta migración se limpiaron manualmente 221 filas duplicadas ya existentes en producción
-- (una por cada cantón de Ecuador), reasignando previamente las relaciones de usuarios, restaurantes
-- y solicitudes_restaurante que apuntaban a las filas eliminadas hacia la fila sobreviviente.
CREATE UNIQUE INDEX "ux_ciudades_nombre_provincia" ON "ciudades"("nombre", "provincia_id");
