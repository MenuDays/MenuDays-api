-- Agrega un valor nuevo al enum notificacion_tipo para notificar al
-- administrador cuando llega una solicitud de restaurante nueva a
-- revisar. Los valores existentes (solicitud_aprobada, etc.) no se
-- tocan -- esto es puramente aditivo, no borra ni modifica nada.
ALTER TYPE "notificacion_tipo" ADD VALUE IF NOT EXISTS 'solicitud_nueva';
