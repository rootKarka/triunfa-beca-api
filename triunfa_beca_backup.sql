--
-- PostgreSQL database dump
--

\restrict 5JJctfYTwwLCUygYYc0OmcoqQX6czTEW0OCfsGK1XeVNxuBAXaEe5H6KPph5zgr

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: catalogo_opciones; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.catalogo_opciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    catalogo_id uuid NOT NULL,
    nombre character varying NOT NULL,
    activo boolean DEFAULT true,
    orden integer DEFAULT 0,
    fecha_creacion timestamp with time zone DEFAULT now()
);


ALTER TABLE public.catalogo_opciones OWNER TO triunfa_user;

--
-- Name: catalogos; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.catalogos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying NOT NULL,
    nombre character varying NOT NULL,
    activo boolean DEFAULT true,
    fecha_creacion timestamp with time zone DEFAULT now()
);


ALTER TABLE public.catalogos OWNER TO triunfa_user;

--
-- Name: imagenes; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.imagenes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url character varying NOT NULL,
    texto_alt character varying,
    seccion character varying NOT NULL,
    orden integer DEFAULT 0,
    es_activa boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now(),
    nombre character varying DEFAULT 'Sin nombre'::character varying NOT NULL,
    grupo character varying
);


ALTER TABLE public.imagenes OWNER TO triunfa_user;

--
-- Name: navegacion; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.navegacion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying NOT NULL,
    enlace character varying DEFAULT '#'::character varying,
    padre_id uuid,
    orden integer DEFAULT 0,
    es_activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.navegacion OWNER TO triunfa_user;

--
-- Name: secciones; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.secciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    etiqueta character varying NOT NULL,
    titulo character varying NOT NULL,
    descripcion text,
    texto_boton character varying,
    orden integer DEFAULT 0,
    es_activa boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.secciones OWNER TO triunfa_user;

--
-- Name: solicitudes_informacion; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.solicitudes_informacion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombres_apellidos character varying NOT NULL,
    dni character varying NOT NULL,
    celular character varying NOT NULL,
    correo character varying NOT NULL,
    nivel_educativo character varying NOT NULL,
    servicio_interes character varying NOT NULL,
    mensaje text,
    canal_preferido character varying DEFAULT 'WhatsApp'::character varying,
    fecha_solicitud timestamp without time zone DEFAULT now(),
    estado character varying DEFAULT 'PENDIENTE'::character varying
);


ALTER TABLE public.solicitudes_informacion OWNER TO triunfa_user;

--
-- Name: solicitudes_matricula; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.solicitudes_matricula (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    est_nombres character varying NOT NULL,
    est_apellido_paterno character varying NOT NULL,
    est_apellido_materno character varying NOT NULL,
    est_dni character varying NOT NULL,
    est_fecha_nacimiento date NOT NULL,
    est_celular character varying NOT NULL,
    est_correo character varying NOT NULL,
    nivel_educativo character varying NOT NULL,
    grado_modalidad character varying NOT NULL,
    servicio_contratar character varying NOT NULL,
    turno_preferido character varying NOT NULL,
    apod_nombre_completo character varying NOT NULL,
    apod_dni character varying NOT NULL,
    apod_celular character varying NOT NULL,
    apod_correo character varying,
    fecha_solicitud timestamp without time zone DEFAULT now(),
    estado character varying DEFAULT 'PENDIENTE'::character varying
);


ALTER TABLE public.solicitudes_matricula OWNER TO triunfa_user;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: triunfa_user
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying NOT NULL,
    correo character varying NOT NULL,
    password_hash character varying NOT NULL,
    role character varying DEFAULT 'staff'::character varying NOT NULL,
    es_activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO triunfa_user;

--
-- Data for Name: catalogo_opciones; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.catalogo_opciones (id, catalogo_id, nombre, activo, orden, fecha_creacion) FROM stdin;
837f6f5c-af19-49a0-8dd6-5d8f3aab39bf	4dc575c3-7265-487f-9d49-66d0ae7fce0e	Preuniversitario	t	4	2026-09-16 21:23:05.878882+00
69ee6105-03ce-4958-a787-d267dcd24c06	4dc575c3-7265-487f-9d49-66d0ae7fce0e	Secundaria	t	3	2026-09-16 21:23:05.878882+00
fa3f0c85-72de-4c0e-8db6-a648209f3b0e	4dc575c3-7265-487f-9d49-66d0ae7fce0e	Primaria	t	2	2026-09-16 21:23:05.878882+00
29199902-9ebd-4fa8-8b91-cfc5e3b3efa9	4dc575c3-7265-487f-9d49-66d0ae7fce0e	Inicial	t	1	2026-09-16 21:23:05.878882+00
790caf8b-1c87-4ea2-ab42-984cd21b6a4e	2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	Información general	t	5	2026-09-16 21:23:05.878882+00
4175b6d6-1fa2-4300-8da0-40cb74b62ee3	2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	Talleres	t	4	2026-09-16 21:23:05.878882+00
639091d4-64a8-4595-8075-edd11d1636a9	2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	Beca 18	t	3	2026-09-16 21:23:05.878882+00
f6e700fd-6f4b-4e15-9c74-26ca3adb2735	2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	Matrícula	t	2	2026-09-16 21:23:05.878882+00
c863250f-4e5f-4183-bc4c-27a56e3e77c2	2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	Reforzamiento académico	t	1	2026-09-16 21:23:05.878882+00
7a811827-389d-4096-b836-153df96761ed	6e51864e-0588-4aff-beab-7147b021a0ad	Preuniversitario - Beca 18	t	16	2026-09-16 21:23:05.878882+00
96edd1fa-5e06-4549-93a4-5ecd443f906f	6e51864e-0588-4aff-beab-7147b021a0ad	Preuniversitario - Ciclo regular	t	15	2026-09-16 21:23:05.878882+00
61b3c602-47fe-4dc1-a28b-2392c3964b8b	6e51864e-0588-4aff-beab-7147b021a0ad	5° secundaria	t	14	2026-09-16 21:23:05.878882+00
12748198-4b51-4fa8-875c-bd906b70b709	6e51864e-0588-4aff-beab-7147b021a0ad	4° secundaria	t	13	2026-09-16 21:23:05.878882+00
a0508fbe-286b-4277-8135-85aa4eadf103	6e51864e-0588-4aff-beab-7147b021a0ad	3° secundaria	t	12	2026-09-16 21:23:05.878882+00
a18e4477-7b43-422f-9f36-cab1ffb38c24	6e51864e-0588-4aff-beab-7147b021a0ad	2° secundaria	t	11	2026-09-16 21:23:05.878882+00
aa18ab3a-0383-4b42-88e3-4eddb1fec931	6e51864e-0588-4aff-beab-7147b021a0ad	1° secundaria	t	10	2026-09-16 21:23:05.878882+00
e3f80a62-4cf2-4bdb-9728-5b3dc460b1b0	6e51864e-0588-4aff-beab-7147b021a0ad	6° grado	t	9	2026-09-16 21:23:05.878882+00
70b4b7b7-f2d6-48a0-9b92-bb7cf5edef8e	6e51864e-0588-4aff-beab-7147b021a0ad	5° grado	t	8	2026-09-16 21:23:05.878882+00
041c749d-6ebc-423e-9470-98364173e995	6e51864e-0588-4aff-beab-7147b021a0ad	4° grado	t	7	2026-09-16 21:23:05.878882+00
b0f4e46c-89ef-4595-8842-637b90f64432	6e51864e-0588-4aff-beab-7147b021a0ad	3° grado	t	6	2026-09-16 21:23:05.878882+00
0a9834f2-a430-4293-884e-8b2f21d84584	6e51864e-0588-4aff-beab-7147b021a0ad	2° grado	t	5	2026-09-16 21:23:05.878882+00
e8e7c662-1567-4bb9-a192-212455de9c61	6e51864e-0588-4aff-beab-7147b021a0ad	1° grado	t	4	2026-09-16 21:23:05.878882+00
df0ec948-9922-42ad-97ae-b50624fa22c2	6e51864e-0588-4aff-beab-7147b021a0ad	5 años	t	3	2026-09-16 21:23:05.878882+00
8720399d-a003-4ac7-ac7a-103177119d7c	6e51864e-0588-4aff-beab-7147b021a0ad	4 años	t	2	2026-09-16 21:23:05.878882+00
ebbbd2ec-c433-44d5-9ced-d7a128ff7acc	6e51864e-0588-4aff-beab-7147b021a0ad	3 años	t	1	2026-09-16 21:23:05.878882+00
e3f2913c-0ce6-49a5-9e8d-1729d5c163f3	f595730b-de4a-4dbc-9dec-9758f2183ac8	Turno Tarde (3:00 PM - 6:00 PM)	t	2	2026-09-16 21:23:05.878882+00
759dc198-88a4-4f86-956a-dcf4844892ea	f595730b-de4a-4dbc-9dec-9758f2183ac8	Turno Mañana (8:30 AM - 12:00 PM)	t	1	2026-09-16 21:23:05.878882+00
\.


--
-- Data for Name: catalogos; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.catalogos (id, codigo, nombre, activo, fecha_creacion) FROM stdin;
4dc575c3-7265-487f-9d49-66d0ae7fce0e	NIVEL_EDUCATIVO	Nivel educativo	t	2026-09-16 21:23:05.875717+00
2718faa6-06a1-4de3-b2c1-3418bbe7b5ba	SERVICIO	Servicio	t	2026-09-16 21:23:05.875717+00
6e51864e-0588-4aff-beab-7147b021a0ad	GRADO_MODALIDAD	Grado / modalidad	t	2026-09-16 21:23:05.875717+00
f595730b-de4a-4dbc-9dec-9758f2183ac8	TURNO	Turno preferido	t	2026-09-16 21:23:05.875717+00
\.


--
-- Data for Name: imagenes; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.imagenes (id, url, texto_alt, seccion, orden, es_activa, fecha_creacion, nombre, grupo) FROM stdin;
ed47c547-6c3d-461c-bac2-9c84c7373fb8	/uploads/imagenes/f151b071-be96-42c6-ba32-ce403cbb379b.jpeg	ajedrez	talleres	0	t	2026-09-17 13:27:12.70763	Sin nombre	\N
4a320749-7fb4-433c-9ed6-96cc7b262745	/uploads/imagenes/a38adaea-c089-448a-8218-0e1d0f9e4b40.jpeg	Futbol	talleres	3	t	2026-09-17 13:22:19.46998	Sin nombre	\N
a85210e5-d96d-4580-b581-941c43a0750e	/uploads/imagenes/d4be9605-89a4-43fc-b879-2f6df1efb44c.jpeg	Manualidades	talleres	2	t	2026-09-17 13:21:54.153963	Sin nombre	\N
753db6c8-0aff-4d72-a3a2-8d8f5cd1287e	/uploads/imagenes/cad282f2-33cb-4eff-86e8-e6f849c7cd8a.png	imagen principal	hero	1	t	2026-09-18 04:07:32.465339	Sin nombre	\N
2b5085fd-32a7-4e2d-b509-67c6a6e11c35	/uploads/imagenes/a82c9140-3fb3-47e3-8997-8b22ca324d53.png	foto parte de arriba	hero	3	t	2026-09-18 04:09:11.277868	Sin nombre	\N
84d1ee3c-bcff-422b-9e1a-4bbf91dcb7a4	/uploads/imagenes/aedee190-f52d-4d0e-9275-6f22f1ad3402.png	parte de abajo	hero	2	t	2026-09-18 04:08:31.222875	Sin nombre	\N
ab54326d-6fde-445c-8206-894e1fdc8b84	/uploads/imagenes/eb97955f-239b-4175-947f-55709fbf793d.jpeg	Formación académica	nosotros	0	t	2026-09-18 04:24:48.350716	Sin nombre	\N
592c8fe9-c98e-4ba8-bb04-376809a32035	/uploads/imagenes/b7df1b4c-d1c0-46b5-9cc6-7f67ffce6c46.jpeg	Orientación Beca 18	nosotros	0	t	2026-09-18 04:28:24.18237	Sin nombre	\N
2e68cf5c-62b1-494c-8201-0dc8f30bd00d	/uploads/imagenes/7fe6cde5-9869-4fa4-b84a-6da96272ef2c.jpeg	Inicial	niveles	0	t	2026-09-18 04:30:57.337923	Sin nombre	\N
981ba5f7-e32b-4f00-a24f-d7442e80461f	/uploads/imagenes/185595a8-2d3b-46b9-8781-9eba4564f82b.jpeg	Secundaria	niveles	0	t	2026-09-18 04:32:38.132787	Sin nombre	\N
327f495b-8abe-4bde-8c97-b0e7a87a0445	/uploads/imagenes/8c6c0fb2-b300-43b8-abdc-8cb6d1659cc2.jpeg	Preuniversitario	niveles	0	t	2026-09-18 04:34:07.690743	Sin nombre	\N
c25890b6-7221-48e5-850d-b8c0eedd62bd	/uploads/imagenes/59d4f5dc-9f5c-4b56-91a7-777732dd90f8.jpeg	Preparación preuniversitaria	nosotros	0	t	2026-09-18 04:35:33.291906	Sin nombre	\N
5f0683e7-b6a7-46be-846e-982844467ea0	/uploads/imagenes/80ef7bb6-5b8d-43a2-a2e0-d858067048ef.png	Acompañamiento personalizado	nosotros	0	t	2026-09-18 04:48:05.666973	Sin nombre	\N
06876b94-0ef1-4e92-8d62-fbbf48410599	/uploads/imagenes/d22317a3-3875-4367-bdfc-b4b5a61e617f.png	Primaria	niveles	0	t	2026-09-18 15:47:00.853544	Sin nombre	\N
\.


--
-- Data for Name: navegacion; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.navegacion (id, nombre, enlace, padre_id, orden, es_activo, fecha_creacion, fecha_actualizacion) FROM stdin;
b80367fc-10e0-426f-8e4a-ceefda7979c2	Inicio	#inicio	\N	1	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:33.925023
b2d1b36f-b62a-4bf8-a239-8d75afff49f3	Nosotros	#nosotros	\N	2	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:34.675564
38b0cab1-3c88-4dd9-b011-ec435e576f5e	Niveles	#niveles	\N	3	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:35.773444
f5acc929-0c25-4899-a44e-c80c9ee1011b	Beca 18	#beca18	\N	4	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:36.332971
f6dad921-e847-4a9e-9fec-481115ffb63f	Talleres	#talleres	\N	5	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:36.901617
0ef6aa84-74ef-449d-b5a4-bcad628e280c	Contacto	#contacto	\N	6	t	2026-09-20 18:10:10.276693	2026-09-21 01:11:37.573039
\.


--
-- Data for Name: secciones; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.secciones (id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa, fecha_creacion, fecha_actualizacion) FROM stdin;
8ecc4f25-1b0e-4f3f-8a46-6e5af1292fe1	¿POR QUÉ ELEGIR TRIUNFA BECA?	Preparándote para alcanzar tus metas	Una academia cercana, con docentes que acompañan a cada estudiante en su propio ritmo de aprendizaje.		2	t	2026-09-20 14:41:38.258037	2026-09-20 17:24:54.420002
39020862-6877-4545-ad57-9f1f827c3446	NIVELES ACADÉMICOS	Encuentra el programa ideal para ti	Reforzamiento en todos los niveles, con turnos de mañana y tarde de lunes a viernes.	Solicitar información	3	t	2026-09-20 14:41:38.258037	2026-09-20 17:24:55.667011
92c151ff-feaf-4b6d-9759-53d91a2f708b	TALLERES / SÁBADOS	Aprende también fuera del aula	Actividades complementarias para que cada estudiante descubra sus talentos.	\N	5	t	2026-09-20 14:41:38.258037	2026-09-20 17:24:58.035023
f93f2514-5802-4246-8c9e-c7cfba6a6028	HORARIOS	Horarios de atención y clases	Turnos de mañana y tarde de lunes a viernes.	\N	6	t	2026-09-20 14:41:38.258037	2026-09-20 17:25:00.659577
6b0835e3-e425-4171-a2b3-a2579b45d426	PRE-MATRÍCULA	Inicia tu matrícula	Registra tus datos y nuestro equipo te contactará para confirmar la información y darte los siguientes pasos.	Enviar solicitud de matrícula	8	t	2026-09-20 14:41:38.258037	2026-09-20 17:25:02.803055
de8c2563-5a82-488c-9783-8869bc8c4d25	CONTACTO	Estamos para ayudarte	Visítanos o escríbenos: con gusto resolvemos todas tus dudas.	\N	9	t	2026-09-20 14:41:38.258037	2026-09-20 17:25:04.108384
16c94e2f-528b-47c3-98ca-b248b49b9451	Academia TRIUNFA BECA	Tu esfuerzo de hoy construye tu futuro.	Prepárate, aprende y alcanza tus metas con Triunfa Beca.	Solicitar información	1	t	2026-09-20 14:41:38.258037	2026-09-21 15:06:05.011073
bc89b707-a589-45e5-9660-57b7cb8f8145	INFORMES	¿Quieres más información ?	Déjanos tus datos y nos pondremos en contacto contigo.	Solicitar información	7	t	2026-09-20 14:41:38.258037	2026-09-20 18:53:40.890282
2e8f7f1b-601a-4503-8f38-0c0cb214b863	PROGRAMA ESPECIAL	¿Quieres postular a Beca 18?	Te acompañamos en el proceso y te brindamos orientación para que puedas conocer mejor los requisitos y oportunidades disponibles.	Quiero asesoramiento	4	t	2026-09-20 14:41:38.258037	2026-09-20 18:55:06.950271
\.


--
-- Data for Name: solicitudes_informacion; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.solicitudes_informacion (id, nombres_apellidos, dni, celular, correo, nivel_educativo, servicio_interes, mensaje, canal_preferido, fecha_solicitud, estado) FROM stdin;
066106e4-8a97-4a05-a7cd-e299c968723d	Ramos quispe juanna	85274136	963852741	biktuantony@gmail.com	Primaria	Matrícula	hola jefes cpomo vamos	WhatsApp	2026-09-06 01:23:59.947167	PENDIENTE
\.


--
-- Data for Name: solicitudes_matricula; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.solicitudes_matricula (id, est_nombres, est_apellido_paterno, est_apellido_materno, est_dni, est_fecha_nacimiento, est_celular, est_correo, nivel_educativo, grado_modalidad, servicio_contratar, turno_preferido, apod_nombre_completo, apod_dni, apod_celular, apod_correo, fecha_solicitud, estado) FROM stdin;
e44ece0e-8ed1-441b-a14f-7af73a75869d	Antony	biktu	Biktu	85274136	2004-12-06	963852741	biktuantony@gmail.com	Primaria	3° secundaria	Matrícula	Turno Mañana (8:30 AM - 12:00 PM)	javier Biktu chamik	85274163	963852274	biktuantony@gmail.com	2026-09-06 04:33:20.052492	PENDIENTE
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: triunfa_user
--

COPY public.usuarios (id, nombre, correo, password_hash, role, es_activo, fecha_creacion) FROM stdin;
c497d13b-24ce-424e-9107-6ba57a147198	Admin	admin@triunfabeca.pe	$2a$10$PgOULy8Pj.HKcFsHlqn31eplK7oUuiEj1Aehqy4XDMNUlotqN5k.W	ADMIN	t	2026-09-16 21:07:44.190179
\.


--
-- Name: catalogo_opciones catalogo_opciones_catalogo_id_nombre_key; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.catalogo_opciones
    ADD CONSTRAINT catalogo_opciones_catalogo_id_nombre_key UNIQUE (catalogo_id, nombre);


--
-- Name: catalogo_opciones catalogo_opciones_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.catalogo_opciones
    ADD CONSTRAINT catalogo_opciones_pkey PRIMARY KEY (id);


--
-- Name: catalogos catalogos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.catalogos
    ADD CONSTRAINT catalogos_codigo_key UNIQUE (codigo);


--
-- Name: catalogos catalogos_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.catalogos
    ADD CONSTRAINT catalogos_pkey PRIMARY KEY (id);


--
-- Name: imagenes imagenes_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.imagenes
    ADD CONSTRAINT imagenes_pkey PRIMARY KEY (id);


--
-- Name: navegacion navegacion_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.navegacion
    ADD CONSTRAINT navegacion_pkey PRIMARY KEY (id);


--
-- Name: secciones secciones_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_informacion solicitudes_informacion_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.solicitudes_informacion
    ADD CONSTRAINT solicitudes_informacion_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_matricula solicitudes_matricula_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.solicitudes_matricula
    ADD CONSTRAINT solicitudes_matricula_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_catalogo_opciones_activo; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_catalogo_opciones_activo ON public.catalogo_opciones USING btree (activo);


--
-- Name: idx_catalogo_opciones_catalogo; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_catalogo_opciones_catalogo ON public.catalogo_opciones USING btree (catalogo_id);


--
-- Name: idx_imagenes_seccion; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_imagenes_seccion ON public.imagenes USING btree (seccion);


--
-- Name: idx_navegacion_padre; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_navegacion_padre ON public.navegacion USING btree (padre_id);


--
-- Name: idx_secciones_orden; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_secciones_orden ON public.secciones USING btree (orden);


--
-- Name: idx_solicitudes_info_estado; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_solicitudes_info_estado ON public.solicitudes_informacion USING btree (estado);


--
-- Name: idx_solicitudes_info_fecha; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_solicitudes_info_fecha ON public.solicitudes_informacion USING btree (fecha_solicitud DESC);


--
-- Name: idx_solicitudes_matricula_estado; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_solicitudes_matricula_estado ON public.solicitudes_matricula USING btree (estado);


--
-- Name: idx_solicitudes_matricula_fecha; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_solicitudes_matricula_fecha ON public.solicitudes_matricula USING btree (fecha_solicitud DESC);


--
-- Name: idx_usuarios_correo; Type: INDEX; Schema: public; Owner: triunfa_user
--

CREATE INDEX idx_usuarios_correo ON public.usuarios USING btree (correo);


--
-- Name: catalogo_opciones catalogo_opciones_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.catalogo_opciones
    ADD CONSTRAINT catalogo_opciones_catalogo_id_fkey FOREIGN KEY (catalogo_id) REFERENCES public.catalogos(id);


--
-- Name: navegacion navegacion_padre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: triunfa_user
--

ALTER TABLE ONLY public.navegacion
    ADD CONSTRAINT navegacion_padre_id_fkey FOREIGN KEY (padre_id) REFERENCES public.navegacion(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 5JJctfYTwwLCUygYYc0OmcoqQX6czTEW0OCfsGK1XeVNxuBAXaEe5H6KPph5zgr

