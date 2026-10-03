CREATE TABLE IF NOT EXISTS navegacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR NOT NULL,
    enlace VARCHAR DEFAULT '#',
    padre_id UUID REFERENCES navegacion(id) ON DELETE CASCADE,
    orden INT DEFAULT 0,
    es_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT now(),
    fecha_actualizacion TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_navegacion_padre ON navegacion(padre_id);