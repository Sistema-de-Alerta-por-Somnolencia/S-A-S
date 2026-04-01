--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

DROP DATABASE sas;
--
-- Name: sas; Type: DATABASE; Schema: -; Owner: bakaa
--

CREATE DATABASE sas WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE sas OWNER TO bakaa;

\connect sas

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administradores; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.administradores (
    id_admin integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido_paterno character varying(50) NOT NULL,
    apellido_materno character varying(50),
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.administradores OWNER TO bakaa;

--
-- Name: administradores_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.administradores_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administradores_id_admin_seq OWNER TO bakaa;

--
-- Name: administradores_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.administradores_id_admin_seq OWNED BY public.administradores.id_admin;


--
-- Name: alertas; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.alertas (
    id integer NOT NULL,
    id_tipo_alerta character varying(50),
    id_unidad character varying(50),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alertas OWNER TO bakaa;

--
-- Name: alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.alertas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.alertas_id_seq OWNER TO bakaa;

--
-- Name: alertas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.alertas_id_seq OWNED BY public.alertas.id;


--
-- Name: choferes; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.choferes (
    id_chofer integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido_paterno character varying(50) NOT NULL,
    apellido_materno character varying(50),
    licencia character varying(25) NOT NULL,
    telefono character varying(10),
    email character varying(100),
    estado boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.choferes OWNER TO bakaa;

--
-- Name: choferes_id_chofer_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.choferes_id_chofer_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.choferes_id_chofer_seq OWNER TO bakaa;

--
-- Name: choferes_id_chofer_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.choferes_id_chofer_seq OWNED BY public.choferes.id_chofer;


--
-- Name: marcas_vehiculo; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.marcas_vehiculo (
    id_marca integer NOT NULL,
    nombre_marca character varying(100) NOT NULL
);


ALTER TABLE public.marcas_vehiculo OWNER TO bakaa;

--
-- Name: marcas_vehiculo_id_marca_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.marcas_vehiculo_id_marca_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.marcas_vehiculo_id_marca_seq OWNER TO bakaa;

--
-- Name: marcas_vehiculo_id_marca_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.marcas_vehiculo_id_marca_seq OWNED BY public.marcas_vehiculo.id_marca;


--
-- Name: modelos_vehiculo; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.modelos_vehiculo (
    id_modelo integer NOT NULL,
    nombre_modelo character varying(100) NOT NULL,
    id_marca integer NOT NULL
);


ALTER TABLE public.modelos_vehiculo OWNER TO bakaa;

--
-- Name: modelos_vehiculo_id_modelo_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.modelos_vehiculo_id_modelo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modelos_vehiculo_id_modelo_seq OWNER TO bakaa;

--
-- Name: modelos_vehiculo_id_modelo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.modelos_vehiculo_id_modelo_seq OWNED BY public.modelos_vehiculo.id_modelo;


--
-- Name: tipos_alerta; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.tipos_alerta (
    id_tipo_alerta integer NOT NULL,
    nombre_alerta character varying(50) NOT NULL
);


ALTER TABLE public.tipos_alerta OWNER TO bakaa;

--
-- Name: tipos_alerta_id_tipo_alerta_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.tipos_alerta_id_tipo_alerta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tipos_alerta_id_tipo_alerta_seq OWNER TO bakaa;

--
-- Name: tipos_alerta_id_tipo_alerta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.tipos_alerta_id_tipo_alerta_seq OWNED BY public.tipos_alerta.id_tipo_alerta;


--
-- Name: unidades; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.unidades (
    id_unidad integer NOT NULL,
    placa character varying(7) NOT NULL,
    anio integer,
    id_chofer integer,
    id_modelo integer
);


ALTER TABLE public.unidades OWNER TO bakaa;

--
-- Name: unidades_id_unidad_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.unidades_id_unidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unidades_id_unidad_seq OWNER TO bakaa;

--
-- Name: unidades_id_unidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.unidades_id_unidad_seq OWNED BY public.unidades.id_unidad;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: bakaa
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(255),
    email character varying(255),
    lastname character varying(255),
    password character varying(255)
);


ALTER TABLE public.usuarios OWNER TO bakaa;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: bakaa
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO bakaa;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bakaa
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: administradores id_admin; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.administradores ALTER COLUMN id_admin SET DEFAULT nextval('public.administradores_id_admin_seq'::regclass);


--
-- Name: alertas id; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.alertas ALTER COLUMN id SET DEFAULT nextval('public.alertas_id_seq'::regclass);


--
-- Name: choferes id_chofer; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.choferes ALTER COLUMN id_chofer SET DEFAULT nextval('public.choferes_id_chofer_seq'::regclass);


--
-- Name: marcas_vehiculo id_marca; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.marcas_vehiculo ALTER COLUMN id_marca SET DEFAULT nextval('public.marcas_vehiculo_id_marca_seq'::regclass);


--
-- Name: modelos_vehiculo id_modelo; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.modelos_vehiculo ALTER COLUMN id_modelo SET DEFAULT nextval('public.modelos_vehiculo_id_modelo_seq'::regclass);


--
-- Name: tipos_alerta id_tipo_alerta; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.tipos_alerta ALTER COLUMN id_tipo_alerta SET DEFAULT nextval('public.tipos_alerta_id_tipo_alerta_seq'::regclass);


--
-- Name: unidades id_unidad; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.unidades ALTER COLUMN id_unidad SET DEFAULT nextval('public.unidades_id_unidad_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: administradores; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.administradores (id_admin, nombre, apellido_paterno, apellido_materno, email, password, fecha_registro) FROM stdin;
\.


--
-- Data for Name: alertas; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.alertas (id, id_tipo_alerta, id_unidad, fecha_creacion) FROM stdin;
1	dormido	TRK-001	2026-03-19 01:55:35.386854
2	dormido	TRK-001	2026-03-19 01:55:35.519768
3	dormido	TRK-001	2026-03-19 01:55:35.57926
4	dormido	TRK-001	2026-03-19 01:55:35.629865
5	dormido	TRK-001	2026-03-19 01:55:35.697286
6	dormido	TRK-001	2026-03-19 01:55:35.772641
7	dormido	TRK-001	2026-03-19 01:55:35.83207
8	dormido	TRK-001	2026-03-19 01:55:38.62738
9	dormido	TRK-001	2026-03-19 01:55:38.677612
10	dormido	TRK-001	2026-03-19 01:55:38.751557
11	dormido	TRK-001	2026-03-19 01:55:38.788755
12	dormido	TRK-001	2026-03-19 01:55:47.125361
13	dormido	TRK-001	2026-03-19 01:55:47.231997
14	dormido	TRK-001	2026-03-19 01:55:48.340734
15	dormido	TRK-001	2026-03-19 01:55:48.390481
16	dormido	TRK-001	2026-03-19 01:55:48.446362
17	dormido	TRK-001	2026-03-19 01:55:48.52097
18	dormido	TRK-001	2026-03-19 01:55:48.56109
19	dormido	TRK-001	2026-03-19 01:55:48.630694
20	dormido	TRK-001	2026-03-19 01:55:48.680596
21	dormido	TRK-001	2026-03-19 02:00:44.92475
22	dormido	TRK-001	2026-03-19 02:00:44.969561
23	dormido	TRK-001	2026-03-19 02:00:45.047527
24	dormido	TRK-001	2026-03-19 02:00:46.983675
25	dormido	TRK-001	2026-03-19 02:00:47.034967
26	dormido	TRK-001	2026-03-19 02:00:47.108146
27	dormido	TRK-001	2026-03-19 02:00:47.903408
28	dormido	TRK-001	2026-03-19 02:00:47.998862
29	dormido	TRK-001	2026-03-19 02:00:48.113086
30	dormido	TRK-001	2026-03-19 02:00:48.173322
31	dormido	TRK-001	2026-03-19 02:00:50.505944
32	dormido	TRK-001	2026-03-19 02:00:50.57447
33	dormido	TRK-001	2026-03-19 02:00:50.659399
34	dormido	TRK-001	2026-03-19 02:00:50.699511
35	dormido	TRK-001	2026-03-19 02:00:53.570028
36	dormido	TRK-001	2026-03-19 02:00:53.642171
37	dormido	TRK-001	2026-03-19 02:00:53.698144
38	dormido	TRK-001	2026-03-19 02:00:53.775089
39	dormido	TRK-001	2026-03-19 02:00:55.660066
40	dormido	TRK-001	2026-03-19 02:00:55.727626
41	dormido	TRK-001	2026-03-19 02:00:57.58935
42	dormido	TRK-001	2026-03-19 02:00:57.656916
43	dormido	TRK-001	2026-03-19 02:01:39.074889
44	dormido	TRK-001	2026-03-19 02:01:39.19409
45	dormido	TRK-001	2026-03-19 02:01:39.246932
46	dormido	TRK-001	2026-03-19 02:01:39.328826
47	dormido	TRK-001	2026-03-19 02:01:41.306819
48	dormido	TRK-001	2026-03-19 02:01:41.360451
49	dormido	TRK-001	2026-03-19 02:01:41.426975
50	dormido	TRK-001	2026-03-19 02:01:41.492053
51	dormido	TRK-001	2026-03-19 02:01:41.530383
52	dormido	TRK-001	2026-03-19 02:01:41.601105
53	dormido	TRK-001	2026-03-19 02:01:41.651629
54	dormido	TRK-001	2026-03-19 02:01:41.716961
55	dormido	TRK-001	2026-03-19 02:01:41.768607
56	dormido	TRK-001	2026-03-19 02:01:41.833229
57	dormido	TRK-001	2026-03-19 02:01:41.888286
58	dormido	TRK-001	2026-03-19 02:01:41.949936
59	dormido	TRK-001	2026-03-19 02:01:42.021274
60	dormido	TRK-001	2026-03-19 02:01:42.059158
61	dormido	TRK-001	2026-03-19 02:01:42.523
62	dormido	TRK-001	2026-03-19 02:01:42.569027
63	dormido	TRK-001	2026-03-19 02:01:42.617091
64	dormido	TRK-001	2026-03-19 02:01:42.680786
65	dormido	TRK-001	2026-03-19 02:01:42.714501
66	dormido	TRK-001	2026-03-19 02:01:42.773333
67	dormido	TRK-001	2026-03-19 02:01:43.740751
68	dormido	TRK-001	2026-03-19 02:01:43.843048
69	dormido	TRK-001	2026-03-19 02:03:38.921982
70	dormido	TRK-001	2026-03-19 02:08:49.992041
71	dormido	TRK-001	2026-03-19 02:09:16.038366
72	dormido	TRK-001	2026-03-19 02:09:47.13623
73	dormido	TRK-001	2026-03-19 02:21:06.906703
74	dormido	TRK-001	2026-03-19 02:23:08.264716
75	dormido	TRK-001	2026-03-19 02:23:25.919832
76	dormido	TRK-001	2026-03-19 02:57:11.345214
77	dormido	TRK-001	2026-03-19 02:57:23.599339
78	dormido	TRK-001	2026-03-19 02:58:31.906838
79	dormido	TRK-001	2026-03-19 12:36:38.922473
80	dormido	TRK-001	2026-03-22 22:26:37.987299
81	dormido	TRK-001	2026-03-22 22:27:03.620602
82	dormido	TRK-001	2026-03-22 22:30:53.522471
83	dormido	TRK-001	2026-03-22 22:33:24.277642
84	dormido	TRK-001	2026-03-22 22:33:53.829524
85	dormido	TRK-001	2026-03-22 22:34:24.300612
86	dormido	TRK-001	2026-03-22 22:37:25.044948
87	dormido	TRK-001	2026-03-22 22:38:07.997126
88	\N	\N	2026-03-22 22:40:46.8154
89	dormido	TRK-001	2026-03-22 22:41:43.281388
90	dormido	TRK-001	2026-03-22 23:08:49.301817
91	dormido	TRK-001	2026-03-22 23:08:49.316446
92	dormido	TRK-001	2026-03-22 23:09:03.62217
93	dormido	TRK-001	2026-03-22 23:09:03.650508
94	dormido	TRK-001	2026-03-22 23:12:51.910741
95	dormido	TRK-001	2026-03-22 23:14:07.031415
96	dormido	TRK-001	2026-03-22 23:14:23.642718
97	dormido	TRK-001	2026-03-22 23:20:36.981126
98	dormido	TRK-001	2026-03-23 01:25:29.751357
99	dormido	TRK-001	2026-03-28 02:01:57.841907
100	dormido	TRK-001	2026-03-28 02:07:52.447417
101	dormido	TRK-001	2026-03-28 02:12:34.411319
102	dormido	TRK-001	2026-03-28 02:16:12.087465
103	dormido	TRK-001	2026-03-28 02:17:07.210139
104	dormido	TRK-001	2026-03-28 02:20:41.915999
\.


--
-- Data for Name: choferes; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.choferes (id_chofer, nombre, apellido_paterno, apellido_materno, licencia, telefono, email, estado, fecha_registro) FROM stdin;
1	juan	perez	lopez	1134134	43434343	juan@gmail.com	t	2026-03-22 23:18:51.401001
2	erick	erick	erick	33|	3333	erick@gmail.com	t	2026-03-22 23:24:05.218486
3	1133	343	3434	111111	hola	hola@gmail.com	t	2026-03-22 23:25:03.689725
4	Diego	Vazquez	Escutia	1413431f	342352523	Diego@gmail.com	t	2026-03-23 01:08:24.984484
5	Cesar	Antunez	 	5546462	\N	alf@gmail.com	t	2026-03-23 01:17:06.787369
6	Edgar	Cardenas		413431413	342352345|	edgar@gmail.com	t	2026-03-23 01:18:25.869028
7	ale	vaca	pintor	131334			t	2026-03-23 01:25:16.11095
\.


--
-- Data for Name: marcas_vehiculo; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.marcas_vehiculo (id_marca, nombre_marca) FROM stdin;
\.


--
-- Data for Name: modelos_vehiculo; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.modelos_vehiculo (id_modelo, nombre_modelo, id_marca) FROM stdin;
\.


--
-- Data for Name: tipos_alerta; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.tipos_alerta (id_tipo_alerta, nombre_alerta) FROM stdin;
\.


--
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.unidades (id_unidad, placa, anio, id_chofer, id_modelo) FROM stdin;
1	a3432	2026	1	\N
2	XYZ9876	2026	2	\N
3	XYZ9871	2021	3	\N
5	XYZ9801	2020	4	\N
10	NUEVA99	2026	1	\N
12	NUE199	2026	5	\N
13	N199	2026	6	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: bakaa
--

COPY public.usuarios (id, nombre, email, lastname, password) FROM stdin;
1	1	3	2	4
2	Ale	a@gmail.com	Vaca	alfa
3	Erick	erick@gmail.com	Pintor	$2b$10$0GWwzIgICS67ViQLuz.kVOgSXt26psGNE2XXLzyXOFHRXUN.zROXC
4	erick	ale@gmail.com	pintor	$2b$10$9wy5aoC60ryzwoLw8DIJfui/HFvpVzySzorPCZ5riAMOpJJ69Ebfu
5	Karen	ale@gmail.com	Vaca	$2b$10$eAy77kPG3R4sTVkQMkAjKuUh5o7h3sgc8g6sPW31hnP6LnkG/LD8q
\.


--
-- Name: administradores_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.administradores_id_admin_seq', 1, false);


--
-- Name: alertas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.alertas_id_seq', 104, true);


--
-- Name: choferes_id_chofer_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.choferes_id_chofer_seq', 7, true);


--
-- Name: marcas_vehiculo_id_marca_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.marcas_vehiculo_id_marca_seq', 1, false);


--
-- Name: modelos_vehiculo_id_modelo_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.modelos_vehiculo_id_modelo_seq', 1, false);


--
-- Name: tipos_alerta_id_tipo_alerta_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.tipos_alerta_id_tipo_alerta_seq', 1, false);


--
-- Name: unidades_id_unidad_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.unidades_id_unidad_seq', 13, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bakaa
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 5, true);


--
-- Name: administradores administradores_email_key; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_email_key UNIQUE (email);


--
-- Name: administradores administradores_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_pkey PRIMARY KEY (id_admin);


--
-- Name: alertas alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_pkey PRIMARY KEY (id);


--
-- Name: choferes choferes_email_key; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.choferes
    ADD CONSTRAINT choferes_email_key UNIQUE (email);


--
-- Name: choferes choferes_licencia_key; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.choferes
    ADD CONSTRAINT choferes_licencia_key UNIQUE (licencia);


--
-- Name: choferes choferes_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.choferes
    ADD CONSTRAINT choferes_pkey PRIMARY KEY (id_chofer);


--
-- Name: marcas_vehiculo marcas_vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.marcas_vehiculo
    ADD CONSTRAINT marcas_vehiculo_pkey PRIMARY KEY (id_marca);


--
-- Name: modelos_vehiculo modelos_vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.modelos_vehiculo
    ADD CONSTRAINT modelos_vehiculo_pkey PRIMARY KEY (id_modelo);


--
-- Name: tipos_alerta tipos_alerta_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.tipos_alerta
    ADD CONSTRAINT tipos_alerta_pkey PRIMARY KEY (id_tipo_alerta);


--
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id_unidad);


--
-- Name: unidades unidades_placa_key; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_placa_key UNIQUE (placa);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: modelos_vehiculo modelos_vehiculo_id_marca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.modelos_vehiculo
    ADD CONSTRAINT modelos_vehiculo_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marcas_vehiculo(id_marca);


--
-- Name: unidades unidades_id_chofer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_id_chofer_fkey FOREIGN KEY (id_chofer) REFERENCES public.choferes(id_chofer);


--
-- Name: unidades unidades_id_modelo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bakaa
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_id_modelo_fkey FOREIGN KEY (id_modelo) REFERENCES public.modelos_vehiculo(id_modelo);


--
-- PostgreSQL database dump complete
--

