-- Permite ocultar un pedido del historial SIN borrarlo: los datos se
-- conservan para reseñas, auditoría e integridad de relaciones. Cada
-- lado (comensal / restaurante) tiene su propia marca temporal, así
-- ocultar del historial del comensal no afecta la gestión del
-- restaurante ni viceversa. NULL = visible. Puramente aditivo: los
-- pedidos existentes quedan con ambas columnas en NULL.
ALTER TABLE "pedidos"
  ADD COLUMN "oculto_comensal_at" TIMESTAMPTZ(6),
  ADD COLUMN "oculto_restaurante_at" TIMESTAMPTZ(6);
