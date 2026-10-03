CREATE TABLE IF NOT EXISTS ingresantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrera VARCHAR(150) NOT NULL,
  universidad VARCHAR(150) NOT NULL,
  modalidad VARCHAR(150),
  imagen_url VARCHAR(500) NOT NULL,
  texto_alt VARCHAR(255),
  orden INTEGER NOT NULL DEFAULT 0,
  es_activo BOOLEAN NOT NULL DEFAULT true,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingresantes_activo
ON ingresantes(es_activo);

CREATE INDEX IF NOT EXISTS idx_ingresantes_orden
ON ingresantes(orden);