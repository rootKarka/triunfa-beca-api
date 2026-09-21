CREATE TABLE IF NOT EXISTS secciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etiqueta VARCHAR NOT NULL,
    titulo VARCHAR NOT NULL,
    descripcion TEXT,
    texto_boton VARCHAR,
    orden INT DEFAULT 0,
    es_activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT now(),
    fecha_actualizacion TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_secciones_orden ON secciones(orden);