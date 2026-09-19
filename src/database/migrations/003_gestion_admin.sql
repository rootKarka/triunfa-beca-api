-- ============================================
-- Triunfa Beca - Migración 003: Gestión Admin
-- Materializa las tablas 3.4-3.7 de la Documentación
-- Técnica de Base de Datos v1.0 y normaliza los estados
-- de las solicitudes a: nuevo | contacto | matriculado | descartado
--
-- REQUISITO PREVIO: backup (pg_dump) de la base de datos.
-- Idempotente: puede re-ejecutarse sin errores.
--
-- Desviaciones del documento (decisiones acordadas):
--   * UNIQUE(titulo) en respuestas_rapidas: permite seed idempotente.
--   * UNIQUE(solicitud_tipo, solicitud_id) en seguimiento_respuestas:
--     garantiza 1 fila de seguimiento por solicitud (upsert seguro).
--   * estado_seguimiento usa el mismo vocabulario normalizado.
--   * comunicaciones_enviadas agrega columna "agente".
-- ============================================

BEGIN;

-- --------------------------------------------
-- 1. Normalización de estados (conserva los datos existentes)
-- --------------------------------------------

-- 1.1 solicitudes_informacion (valores previos: PENDIENTE, CONTACTADO, CERRADO)
ALTER TABLE solicitudes_informacion ALTER COLUMN estado DROP DEFAULT;
UPDATE solicitudes_informacion SET estado = 'nuevo'      WHERE estado = 'PENDIENTE';
UPDATE solicitudes_informacion SET estado = 'contacto'   WHERE estado = 'CONTACTADO';
UPDATE solicitudes_informacion SET estado = 'descartado' WHERE estado = 'CERRADO';
ALTER TABLE solicitudes_informacion ALTER COLUMN estado SET DEFAULT 'nuevo';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_solicitudes_info_estado') THEN
    ALTER TABLE solicitudes_informacion
      ADD CONSTRAINT chk_solicitudes_info_estado
      CHECK (estado IN ('nuevo','contacto','matriculado','descartado'));
  END IF;
END $$;

-- 1.2 solicitudes_matricula (valores previos: PENDIENTE, CONTACTADO, EN_PROCESO, MATRICULADO, RECHAZADO)
ALTER TABLE solicitudes_matricula ALTER COLUMN estado DROP DEFAULT;
UPDATE solicitudes_matricula SET estado = 'nuevo'       WHERE estado = 'PENDIENTE';
UPDATE solicitudes_matricula SET estado = 'contacto'    WHERE estado IN ('CONTACTADO','EN_PROCESO');
UPDATE solicitudes_matricula SET estado = 'matriculado' WHERE estado = 'MATRICULADO';
UPDATE solicitudes_matricula SET estado = 'descartado'  WHERE estado = 'RECHAZADO';
ALTER TABLE solicitudes_matricula ALTER COLUMN estado SET DEFAULT 'nuevo';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_solicitudes_mat_estado') THEN
    ALTER TABLE solicitudes_matricula
      ADD CONSTRAINT chk_solicitudes_mat_estado
      CHECK (estado IN ('nuevo','contacto','matriculado','descartado'));
  END IF;
END $$;

-- --------------------------------------------
-- 2. Código correlativo SOL-####
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS contadores (
  clave VARCHAR PRIMARY KEY,
  valor BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE solicitudes_informacion ADD COLUMN IF NOT EXISTS codigo VARCHAR UNIQUE;
ALTER TABLE solicitudes_matricula   ADD COLUMN IF NOT EXISTS codigo VARCHAR UNIQUE;

-- Backfill de códigos para registros existentes (info: 1..N, matrícula: N+1.. en orden cronológico)
WITH numerados AS (
  SELECT id,
         'SOL-' || LPAD(ROW_NUMBER() OVER (ORDER BY fecha_solicitud ASC)::text, 4, '0') AS codigo
  FROM solicitudes_informacion
)
UPDATE solicitudes_informacion si
SET codigo = n.codigo
FROM numerados n
WHERE si.id = n.id AND si.codigo IS NULL;

WITH numerados AS (
  SELECT id,
         'SOL-' || LPAD((ROW_NUMBER() OVER (ORDER BY fecha_solicitud ASC)
                         + (SELECT COUNT(*) FROM solicitudes_informacion))::text, 4, '0') AS codigo
  FROM solicitudes_matricula
)
UPDATE solicitudes_matricula sm
SET codigo = n.codigo
FROM numerados n
WHERE sm.id = n.id AND sm.codigo IS NULL;

ALTER TABLE solicitudes_informacion ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE solicitudes_matricula   ALTER COLUMN codigo SET NOT NULL;

INSERT INTO contadores (clave, valor)
VALUES ('solicitudes',
        (SELECT COUNT(*) FROM solicitudes_informacion)
      + (SELECT COUNT(*) FROM solicitudes_matricula))
ON CONFLICT (clave) DO NOTHING;

-- --------------------------------------------
-- 3. Tablas del documento técnico (secciones 3.4 a 3.7)
-- --------------------------------------------

-- 3.4 seguimiento_respuestas (núcleo de gestión de los agentes)
CREATE TABLE IF NOT EXISTS seguimiento_respuestas (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_tipo          VARCHAR NOT NULL,             -- 'INFO' | 'MATRICULA'
  solicitud_id            UUID NOT NULL,                -- relación polimórfica
  agente_asignado         VARCHAR,
  fecha_asignacion        TIMESTAMPTZ,
  fecha_primera_respuesta TIMESTAMPTZ,
  canal_respuesta         VARCHAR,
  notas_internas          TEXT,
  estado_seguimiento      VARCHAR NOT NULL DEFAULT 'nuevo',
  fecha_creacion          TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_seguimiento_solicitud UNIQUE (solicitud_tipo, solicitud_id)
);

-- 3.5 respuestas_rapidas (biblioteca de plantillas)
CREATE TABLE IF NOT EXISTS respuestas_rapidas (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo             VARCHAR NOT NULL UNIQUE,
  categoria          VARCHAR NOT NULL,
  contenido          TEXT NOT NULL,
  veces_usada        INT NOT NULL DEFAULT 0,
  es_activa          BOOLEAN NOT NULL DEFAULT true,
  fecha_creacion     TIMESTAMPTZ DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ
);

-- 3.6 comunicaciones_enviadas (auditoría de mensajes)
CREATE TABLE IF NOT EXISTS comunicaciones_enviadas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_tipo VARCHAR NOT NULL,
  solicitud_id   UUID NOT NULL,
  plantilla_id   UUID REFERENCES respuestas_rapidas(id),
  canal          VARCHAR NOT NULL,                      -- WhatsApp | Llamada | Correo | SMS
  mensaje_enviado TEXT NOT NULL,
  agente         VARCHAR,
  fecha_envio    TIMESTAMPTZ DEFAULT now(),
  estado_entrega VARCHAR NOT NULL DEFAULT 'ENVIADO'
);

-- 3.7 configuracion_sistema (parámetros globales)
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  clave VARCHAR PRIMARY KEY,
  valor TEXT NOT NULL
);

-- --------------------------------------------
-- 4. Índices (sección 5 del documento técnico)
-- --------------------------------------------
CREATE INDEX IF NOT EXISTS idx_solicitudes_info_estado_fecha ON solicitudes_informacion(estado, fecha_solicitud);
CREATE INDEX IF NOT EXISTS idx_solicitudes_mat_estado_fecha ON solicitudes_matricula(estado, fecha_solicitud);
CREATE INDEX IF NOT EXISTS idx_seguimiento_agente_estado ON seguimiento_respuestas(agente_asignado, estado_seguimiento);
CREATE INDEX IF NOT EXISTS idx_respuestas_categoria ON respuestas_rapidas(categoria, es_activa);
CREATE INDEX IF NOT EXISTS idx_comunicaciones_solicitud ON comunicaciones_enviadas(solicitud_tipo, solicitud_id);

-- --------------------------------------------
-- 5. Seed de plantillas (las 12 del frontend, idempotente)
-- --------------------------------------------
INSERT INTO respuestas_rapidas (titulo, categoria, contenido)
SELECT v.titulo, v.categoria, v.contenido
FROM (VALUES
  ('Bienvenida y presentación','Información general',
   E'¡Hola {apoderado}! 👋 Le saludamos de la Academia Triunfa Beca. Recibimos su solicitud para {nombre} ({nivel} - {grado}) sobre {servicio}. ¿Le parece si le cuento los detalles por aquí?'),
  ('Costos de reforzamiento','Costos',
   E'Hola {apoderado}, el reforzamiento académico para {grado} tiene una inversión de S/ 180 al mes (3 veces por semana) e incluye material de trabajo. La matrícula única es de S/ 50. ¿Desea reservar la vacante de {nombre}?'),
  ('Costos preuniversitario','Costos',
   E'Hola {apoderado}, el ciclo preuniversitario cuesta S/ 250 mensuales con simulacros incluidos. Pagando el ciclo completo hay 10% de descuento. Le comparto el detalle para {nombre}.'),
  ('Vacantes disponibles','Matrícula',
   E'Hola {apoderado}, sí contamos con vacantes para {grado} en el {turno}. Para reservar la de {nombre} solo necesitamos su DNI y una separación de S/ 30. ¿Le reservo?'),
  ('Requisitos de matrícula','Matrícula',
   E'Hola {apoderado}, para matricular a {nombre} necesitamos: copia del DNI del estudiante y del apoderado, libreta de notas del último año y el pago de matrícula. Puede traerlos a la academia o enviarlos por aquí.'),
  ('Requisitos Beca 18','Beca 18',
   E'Hola {apoderado}, para postular a Beca 18 se necesita alto rendimiento académico, clasificación socioeconómica elegible en el SISFOH y culminar 5° de secundaria. En Triunfa Beca preparamos a {nombre} para el examen ENP con simulacros semanales.'),
  ('Cronograma Beca 18','Beca 18',
   E'Hola {apoderado}, la convocatoria de Beca 18 abre a inicios de año y el examen se rinde a mitad de año. Nuestro ciclo de preparación dura 6 meses. Le puedo enviar el cronograma completo para {nombre}.'),
  ('Horarios disponibles','Horarios',
   E'Hola {apoderado}, tenemos dos turnos: mañana de 8:30 a 12:00 y tarde de 3:00 a 6:00. Usted marcó {turno} para {nombre}. ¿Le confirmamos ese horario?'),
  ('Clase de prueba gratuita','Información general',
   E'Hola {apoderado}, invitamos a {nombre} a una clase de prueba gratuita esta semana en el {turno}. Solo debe venir con cuaderno y lapicero. ¿Qué día le acomoda?'),
  ('Ubicación y contacto','Información general',
   E'Hola {apoderado}, estamos en Av. Los Héroes 456, a media cuadra de la plaza. Atendemos de lunes a sábado de 8:00 a 7:00 pm. Cualquier duda sobre {servicio} escríbanos por aquí.'),
  ('Seguimiento sin respuesta','Seguimiento',
   E'Hola {apoderado}, le escribimos de Triunfa Beca para saber si aún está interesado en {servicio} para {nombre}. Seguimos guardando su vacante por 48 horas. 😊'),
  ('Confirmación de matrícula','Seguimiento',
   E'¡Felicitaciones {apoderado}! La matrícula de {nombre} en {grado} quedó confirmada para el {turno}. Las clases inician el próximo lunes. Bienvenidos a la familia Triunfa Beca. 🎉')
) AS v(titulo, categoria, contenido)
WHERE NOT EXISTS (SELECT 1 FROM respuestas_rapidas r WHERE r.titulo = v.titulo);

COMMIT;
