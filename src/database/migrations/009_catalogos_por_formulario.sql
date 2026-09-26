INSERT INTO catalogos (codigo,nombre) VALUES
('INFO_NIVEL_EDUCATIVO','Nivel educativo'),
('INFO_SERVICIO_INTERES','Servicio de interés'),
('MATRICULA_NIVEL_EDUCATIVO','Nivel educativo'),
('MATRICULA_GRADO_MODALIDAD','Grado / modalidad'),
('MATRICULA_SERVICIO','Servicio que desea contratar'),
('MATRICULA_TURNO','Turno preferido')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='INFO_NIVEL_EDUCATIVO'
WHERE viejo.codigo='NIVEL_EDUCATIVO'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='INFO_SERVICIO_INTERES'
WHERE viejo.codigo='SERVICIO'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='MATRICULA_NIVEL_EDUCATIVO'
WHERE viejo.codigo='NIVEL_EDUCATIVO'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='MATRICULA_GRADO_MODALIDAD'
WHERE viejo.codigo='GRADO_MODALIDAD'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='MATRICULA_SERVICIO'
WHERE viejo.codigo='SERVICIO'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;

INSERT INTO catalogo_opciones (catalogo_id,nombre,activo,eliminado,orden)
SELECT nuevo.id,o.nombre,o.activo,o.eliminado,o.orden
FROM catalogo_opciones o
JOIN catalogos viejo ON viejo.id=o.catalogo_id
JOIN catalogos nuevo ON nuevo.codigo='MATRICULA_TURNO'
WHERE viejo.codigo='TURNO'
ON CONFLICT (catalogo_id,nombre) DO NOTHING;