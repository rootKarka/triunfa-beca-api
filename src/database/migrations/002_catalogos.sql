CREATE TABLE IF NOT EXISTS catalogos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR NOT NULL UNIQUE,
    nombre VARCHAR NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalogo_opciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalogo_id UUID NOT NULL REFERENCES catalogos(id),
    nombre VARCHAR NOT NULL,
    activo BOOLEAN DEFAULT true,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMPTZ DEFAULT now(),
    UNIQUE (catalogo_id, nombre)
);

CREATE INDEX IF NOT EXISTS idx_catalogo_opciones_catalogo ON catalogo_opciones(catalogo_id);
CREATE INDEX IF NOT EXISTS idx_catalogo_opciones_activo ON catalogo_opciones(activo);

INSERT INTO catalogos (codigo,nombre) VALUES
('NIVEL_EDUCATIVO','Nivel educativo'),
('SERVICIO','Servicio'),
('GRADO_MODALIDAD','Grado / modalidad'),
('TURNO','Turno preferido')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,orden)
SELECT c.id,v.nombre,v.orden
FROM catalogos c
JOIN (VALUES
('NIVEL_EDUCATIVO','Inicial',1),
('NIVEL_EDUCATIVO','Primaria',2),
('NIVEL_EDUCATIVO','Secundaria',3),
('NIVEL_EDUCATIVO','Preuniversitario',4),
('SERVICIO','Reforzamiento académico',1),
('SERVICIO','Matrícula',2),
('SERVICIO','Beca 18',3),
('SERVICIO','Talleres',4),
('SERVICIO','Información general',5),
('GRADO_MODALIDAD','3 años',1),
('GRADO_MODALIDAD','4 años',2),
('GRADO_MODALIDAD','5 años',3),
('GRADO_MODALIDAD','1° grado',4),
('GRADO_MODALIDAD','2° grado',5),
('GRADO_MODALIDAD','3° grado',6),
('GRADO_MODALIDAD','4° grado',7),
('GRADO_MODALIDAD','5° grado',8),
('GRADO_MODALIDAD','6° grado',9),
('GRADO_MODALIDAD','1° secundaria',10),
('GRADO_MODALIDAD','2° secundaria',11),
('GRADO_MODALIDAD','3° secundaria',12),
('GRADO_MODALIDAD','4° secundaria',13),
('GRADO_MODALIDAD','5° secundaria',14),
('GRADO_MODALIDAD','Preuniversitario - Ciclo regular',15),
('GRADO_MODALIDAD','Preuniversitario - Beca 18',16),
('TURNO','Turno Mañana (8:30 AM - 12:00 PM)',1),
('TURNO','Turno Tarde (3:00 PM - 6:00 PM)',2)
) AS v(codigo,nombre,orden) ON c.codigo=v.codigo
ON CONFLICT (catalogo_id,nombre) DO NOTHING;