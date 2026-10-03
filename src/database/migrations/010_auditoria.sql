CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(50) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id UUID,
  descripcion VARCHAR(255) NOT NULL,
  detalle JSONB DEFAULT '{}'::jsonb,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_fecha
ON auditoria(fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario
ON auditoria(usuario_id);