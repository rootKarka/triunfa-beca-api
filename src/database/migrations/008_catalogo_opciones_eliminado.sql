ALTER TABLE catalogo_opciones
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_catalogo_opciones_eliminado
ON catalogo_opciones(eliminado);