-- CreateEnum
CREATE TYPE "auth_token_tipo" AS ENUM ('refresh', 'reset_password', 'verificacion_email');

-- CreateEnum
CREATE TYPE "estado_cuenta_rest" AS ENUM ('activo', 'suspendido', 'eliminado');

-- CreateEnum
CREATE TYPE "estado_cuenta_usuario" AS ENUM ('activo', 'suspendido', 'eliminado');

-- CreateEnum
CREATE TYPE "estado_disponibilidad" AS ENUM ('disponible', 'agotado');

-- CreateEnum
CREATE TYPE "estado_operativo_rest" AS ENUM ('abierto', 'cerrado', 'cerrado_temporal', 'vacaciones');

-- CreateEnum
CREATE TYPE "estado_pedido" AS ENUM ('pendiente', 'aceptado', 'preparando', 'listo', 'entregado', 'rechazado', 'cancelado');

-- CreateEnum
CREATE TYPE "estado_publicacion" AS ENUM ('programado', 'publicado', 'oculto', 'agotado');

-- CreateEnum
CREATE TYPE "estado_reporte" AS ENUM ('pendiente', 'archivado', 'resuelto');

-- CreateEnum
CREATE TYPE "estado_resena" AS ENUM ('visible', 'moderada', 'eliminada');

-- CreateEnum
CREATE TYPE "estado_solicitud" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "item_pedido_tipo" AS ENUM ('menu_dia', 'plato');

-- CreateEnum
CREATE TYPE "notificacion_tipo" AS ENUM ('solicitud_aprobada', 'solicitud_rechazada', 'pedido_aceptado', 'pedido_rechazado', 'pedido_estado', 'pedido_listo', 'restaurante_suspendido', 'recuperacion_password');

-- CreateEnum
CREATE TYPE "red_social_tipo" AS ENUM ('facebook', 'instagram', 'tiktok', 'twitter_x', 'otro');

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('comensal', 'restaurante', 'administrador');

-- CreateEnum
CREATE TYPE "telefono_tipo" AS ENUM ('whatsapp', 'llamadas', 'ambos');

-- CreateTable
CREATE TABLE "auditoria_logs" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT,
    "accion" VARCHAR(100) NOT NULL,
    "entidad_tipo" VARCHAR(50) NOT NULL,
    "entidad_id" BIGINT,
    "datos_previos" JSONB,
    "datos_nuevos" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "tipo" "auth_token_tipo" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expira_en" TIMESTAMPTZ(6) NOT NULL,
    "usado_en" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "icono_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeria_imagenes" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "es_portada" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeria_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iconos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "iconos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_del_dia" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "foto_url" TEXT,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" "estado_publicacion" NOT NULL DEFAULT 'programado',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "menus_del_dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivos_reporte" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,

    CONSTRAINT "motivos_reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "tipo" "notificacion_tipo" NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "referencia_tipo" VARCHAR(50),
    "referencia_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_historial_estados" (
    "id" BIGSERIAL NOT NULL,
    "pedido_id" BIGINT NOT NULL,
    "estado_anterior" "estado_pedido",
    "estado_nuevo" "estado_pedido" NOT NULL,
    "modificado_por" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" BIGSERIAL NOT NULL,
    "codigo_unico" VARCHAR(12) NOT NULL DEFAULT upper(substr(replace((gen_random_uuid())::text, '-'::text, ''::text), 1, 8)),
    "usuario_id" BIGINT NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "tipo_item" "item_pedido_tipo" NOT NULL,
    "menu_dia_id" BIGINT,
    "plato_id" BIGINT,
    "observaciones" TEXT,
    "precio_total" DECIMAL(10,2) NOT NULL,
    "estado" "estado_pedido" NOT NULL DEFAULT 'pendiente',
    "mensaje_whatsapp" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plato_imagenes" (
    "id" BIGSERIAL NOT NULL,
    "plato_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plato_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platos" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "categoria_id" BIGINT NOT NULL,
    "subcategoria_id" BIGINT,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "estado" "estado_disponibilidad" NOT NULL DEFAULT 'disponible',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "platos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "imagen_url" TEXT,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "motivo_id" BIGINT NOT NULL,
    "descripcion" TEXT,
    "estado" "estado_reporte" NOT NULL DEFAULT 'pendiente',
    "revisado_por" BIGINT,
    "revisado_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "pedido_id" BIGINT NOT NULL,
    "calificacion" SMALLINT NOT NULL,
    "comentario" TEXT,
    "respuesta_restaurante" TEXT,
    "respuesta_at" TIMESTAMPTZ(6),
    "estado" "estado_resena" NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurante_horarios" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "dia_semana" SMALLINT NOT NULL,
    "hora_apertura" TIME(6),
    "hora_cierre" TIME(6),
    "cerrado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "restaurante_horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurante_redes_sociales" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "plataforma" "red_social_tipo" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "restaurante_redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurante_telefonos" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "telefono" VARCHAR(30) NOT NULL,
    "tipo" "telefono_tipo" NOT NULL DEFAULT 'ambos',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restaurante_telefonos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurantes" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "solicitud_id" BIGINT,
    "nombre_comercial" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "direccion" VARCHAR(255) NOT NULL,
    "ciudad_id" BIGINT NOT NULL,
    "ubicacion_lat" DECIMAL(9,6) NOT NULL,
    "ubicacion_lng" DECIMAL(9,6) NOT NULL,
    "logo_url" TEXT,
    "portada_url" TEXT,
    "estado_operativo" "estado_operativo_rest" NOT NULL DEFAULT 'cerrado',
    "estado_cuenta" "estado_cuenta_rest" NOT NULL DEFAULT 'activo',
    "vacaciones_inicio" DATE,
    "vacaciones_fin" DATE,
    "atencion_feriados" BOOLEAN NOT NULL DEFAULT false,
    "calificacion_promedio" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "cantidad_resenas" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "restaurantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_restaurante" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "nombre_comercial" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "direccion" VARCHAR(255) NOT NULL,
    "ciudad_id" BIGINT NOT NULL,
    "ubicacion_lat" DECIMAL(9,6) NOT NULL,
    "ubicacion_lng" DECIMAL(9,6) NOT NULL,
    "telefono_contacto" VARCHAR(30) NOT NULL,
    "logo_url" TEXT,
    "portada_url" TEXT,
    "redes_sociales" JSONB NOT NULL DEFAULT '[]',
    "horarios" JSONB NOT NULL DEFAULT '[]',
    "estado" "estado_solicitud" NOT NULL DEFAULT 'pendiente',
    "motivo_rechazo" TEXT,
    "revisado_por" BIGINT,
    "revisado_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_restaurante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" BIGSERIAL NOT NULL,
    "restaurante_id" BIGINT NOT NULL,
    "categoria_id" BIGINT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "icono_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "rol_usuario" NOT NULL DEFAULT 'comensal',
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "foto_perfil_url" TEXT,
    "ubicacion_lat" DECIMAL(9,6),
    "ubicacion_lng" DECIMAL(9,6),
    "radio_busqueda_km" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "estado" "estado_cuenta_usuario" NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "ciudad_id" BIGINT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provincia_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_auditoria_entidad" ON "auditoria_logs"("entidad_tipo", "entidad_id");

-- CreateIndex
CREATE INDEX "ix_auditoria_usuario" ON "auditoria_logs"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "ux_auth_tokens_hash" ON "auth_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "ix_auth_tokens_usuario" ON "auth_tokens"("usuario_id", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE INDEX "ix_favoritos_restaurante" ON "favoritos"("restaurante_id");

-- CreateIndex
CREATE INDEX "ix_favoritos_usuario" ON "favoritos"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_usuario_id_restaurante_id_key" ON "favoritos"("usuario_id", "restaurante_id");

-- CreateIndex
CREATE INDEX "ix_galeria_restaurante" ON "galeria_imagenes"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "iconos_nombre_key" ON "iconos"("nombre");

-- CreateIndex
CREATE INDEX "ix_menus_restaurante" ON "menus_del_dia"("restaurante_id");

-- CreateIndex
CREATE INDEX "ix_menus_vigencia" ON "menus_del_dia"("fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE UNIQUE INDEX "motivos_reporte_nombre_key" ON "motivos_reporte"("nombre");

-- CreateIndex
CREATE INDEX "ix_notificaciones_usuario" ON "notificaciones"("usuario_id", "leida");

-- CreateIndex
CREATE INDEX "ix_historial_pedido" ON "pedido_historial_estados"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "ux_pedidos_codigo" ON "pedidos"("codigo_unico");

-- CreateIndex
CREATE INDEX "ix_pedidos_estado" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "ix_pedidos_restaurante" ON "pedidos"("restaurante_id", "estado");

-- CreateIndex
CREATE INDEX "ix_pedidos_usuario" ON "pedidos"("usuario_id");

-- CreateIndex
CREATE INDEX "ix_plato_imagenes_plato" ON "plato_imagenes"("plato_id");

-- CreateIndex
CREATE INDEX "ix_platos_categoria" ON "platos"("categoria_id");

-- CreateIndex
CREATE INDEX "ix_platos_restaurante" ON "platos"("restaurante_id");

-- CreateIndex
CREATE INDEX "ix_promociones_restaurante" ON "promociones"("restaurante_id");

-- CreateIndex
CREATE INDEX "ix_promociones_vigencia" ON "promociones"("fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE INDEX "ix_reportes_estado" ON "reportes"("estado");

-- CreateIndex
CREATE INDEX "ix_reportes_restaurante" ON "reportes"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_pedido_id_key" ON "resenas"("pedido_id");

-- CreateIndex
CREATE INDEX "ix_resenas_usuario" ON "resenas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurante_horarios_restaurante_id_dia_semana_key" ON "restaurante_horarios"("restaurante_id", "dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "restaurante_redes_sociales_restaurante_id_plataforma_key" ON "restaurante_redes_sociales"("restaurante_id", "plataforma");

-- CreateIndex
CREATE INDEX "ix_restaurante_telefonos_rest" ON "restaurante_telefonos"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurantes_usuario_id_key" ON "restaurantes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurantes_solicitud_id_key" ON "restaurantes"("solicitud_id");

-- CreateIndex
CREATE INDEX "ix_restaurantes_ciudad" ON "restaurantes"("ciudad_id");

-- CreateIndex
CREATE INDEX "ix_restaurantes_estado_cuenta" ON "restaurantes"("estado_cuenta");

-- CreateIndex
CREATE INDEX "ix_restaurantes_estado_operativo" ON "restaurantes"("estado_operativo");

-- CreateIndex
CREATE INDEX "ix_restaurantes_ubicacion" ON "restaurantes"("ubicacion_lat", "ubicacion_lng");

-- CreateIndex
CREATE INDEX "ix_solicitudes_ciudad" ON "solicitudes_restaurante"("ciudad_id");

-- CreateIndex
CREATE INDEX "ix_solicitudes_estado" ON "solicitudes_restaurante"("estado");

-- CreateIndex
CREATE INDEX "ix_solicitudes_usuario" ON "solicitudes_restaurante"("usuario_id");

-- CreateIndex
CREATE INDEX "ix_subcategorias_categoria" ON "subcategorias"("categoria_id");

-- CreateIndex
CREATE INDEX "ix_subcategorias_restaurante" ON "subcategorias"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "subcategorias_restaurante_id_categoria_id_nombre_key" ON "subcategorias"("restaurante_id", "categoria_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "ix_usuarios_rol" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "ix_usuarios_ubicacion" ON "usuarios"("ubicacion_lat", "ubicacion_lng");

-- CreateIndex
CREATE INDEX "ix_usuarios_ciudad" ON "usuarios"("ciudad_id");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_nombre_key" ON "provincias"("nombre");

-- CreateIndex
CREATE INDEX "ix_provincias_nombre" ON "provincias"("nombre");

-- CreateIndex
CREATE INDEX "ix_ciudades_nombre" ON "ciudades"("nombre");

-- CreateIndex
CREATE INDEX "ciudades_provincia_id_idx" ON "ciudades"("provincia_id");

-- AddForeignKey
ALTER TABLE "auditoria_logs" ADD CONSTRAINT "auditoria_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_icono_id_fkey" FOREIGN KEY ("icono_id") REFERENCES "iconos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "galeria_imagenes" ADD CONSTRAINT "galeria_imagenes_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_del_dia" ADD CONSTRAINT "menus_del_dia_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_historial_estados" ADD CONSTRAINT "pedido_historial_estados_modificado_por_fkey" FOREIGN KEY ("modificado_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_historial_estados" ADD CONSTRAINT "pedido_historial_estados_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_menu_dia_id_fkey" FOREIGN KEY ("menu_dia_id") REFERENCES "menus_del_dia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_plato_id_fkey" FOREIGN KEY ("plato_id") REFERENCES "platos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plato_imagenes" ADD CONSTRAINT "plato_imagenes_plato_id_fkey" FOREIGN KEY ("plato_id") REFERENCES "platos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platos" ADD CONSTRAINT "platos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platos" ADD CONSTRAINT "platos_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platos" ADD CONSTRAINT "platos_subcategoria_id_fkey" FOREIGN KEY ("subcategoria_id") REFERENCES "subcategorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_motivo_id_fkey" FOREIGN KEY ("motivo_id") REFERENCES "motivos_reporte"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurante_horarios" ADD CONSTRAINT "restaurante_horarios_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurante_redes_sociales" ADD CONSTRAINT "restaurante_redes_sociales_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurante_telefonos" ADD CONSTRAINT "restaurante_telefonos_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurantes" ADD CONSTRAINT "restaurantes_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantes" ADD CONSTRAINT "restaurantes_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_restaurante"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurantes" ADD CONSTRAINT "restaurantes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes_restaurante" ADD CONSTRAINT "solicitudes_restaurante_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_restaurante" ADD CONSTRAINT "solicitudes_restaurante_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes_restaurante" ADD CONSTRAINT "solicitudes_restaurante_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_icono_id_fkey" FOREIGN KEY ("icono_id") REFERENCES "iconos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "restaurantes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
