-- ============================================
-- Triunfa Beca - Migración Inicial
-- Fecha: 2026-09-02
-- ============================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla: imagenes
CREATE TABLE IF NOT EXISTS imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR NOT NULL,
    texto_alt VARCHAR,
    seccion VARCHAR NOT NULL,
    orden INT DEFAULT 0,
    es_activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT now()
);

-- Tabla: solicitudes_informacion
CREATE TABLE IF NOT EXISTS solicitudes_informacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres_apellidos VARCHAR NOT NULL,
    dni VARCHAR NOT NULL,
    celular VARCHAR NOT NULL,
    correo VARCHAR NOT NULL,
    nivel_educativo VARCHAR NOT NULL,
    servicio_interes VARCHAR NOT NULL,
    mensaje TEXT,
    canal_preferido VARCHAR DEFAULT 'WhatsApp',
    fecha_solicitud TIMESTAMP DEFAULT now(),
    estado VARCHAR DEFAULT 'PENDIENTE'
);

-- Tabla: solicitudes_matricula
CREATE TABLE IF NOT EXISTS solicitudes_matricula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    est_nombres VARCHAR NOT NULL,
    est_apellido_paterno VARCHAR NOT NULL,
    est_apellido_materno VARCHAR NOT NULL,
    est_dni VARCHAR NOT NULL,
    est_fecha_nacimiento DATE NOT NULL,
    est_celular VARCHAR NOT NULL,
    est_correo VARCHAR NOT NULL,
    nivel_educativo VARCHAR NOT NULL,
    grado_modalidad VARCHAR NOT NULL,
    servicio_contratar VARCHAR NOT NULL,
    turno_preferido VARCHAR NOT NULL,
    apod_nombre_completo VARCHAR NOT NULL,
    apod_dni VARCHAR NOT NULL,
    apod_celular VARCHAR NOT NULL,
    apod_correo VARCHAR,
    fecha_solicitud TIMESTAMP DEFAULT now(),
    estado VARCHAR DEFAULT 'PENDIENTE'
);

-- Tabla: usuarios (para el sistema de auth del admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR NOT NULL,
    correo VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    role VARCHAR NOT NULL DEFAULT 'staff',
    es_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT now()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_imagenes_seccion ON imagenes(seccion);
CREATE INDEX IF NOT EXISTS idx_solicitudes_info_estado ON solicitudes_informacion(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_info_fecha ON solicitudes_informacion(fecha_solicitud DESC);
CREATE INDEX IF NOT EXISTS idx_solicitudes_matricula_estado ON solicitudes_matricula(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_matricula_fecha ON solicitudes_matricula(fecha_solicitud DESC);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);