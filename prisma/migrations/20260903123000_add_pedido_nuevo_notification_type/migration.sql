-- Agrega un valor nuevo al enum notificacion_tipo para notificar al
-- restaurante cuando un comensal crea un pedido. Los valores existentes
-- no se tocan -- es puramente aditivo, no borra ni modifica nada.
ALTER TYPE "notificacion_tipo" ADD VALUE IF NOT EXISTS 'pedido_nuevo';
