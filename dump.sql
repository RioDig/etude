--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: auth_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_tokens (
    id integer NOT NULL,
    code character varying,
    email character varying,
    scopes character varying[],
    client_id character varying,
    redirect_uri character varying,
    expires_at timestamp without time zone
);


ALTER TABLE public.auth_tokens OWNER TO postgres;

--
-- Name: auth_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_tokens_id_seq OWNER TO postgres;

--
-- Name: auth_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_tokens_id_seq OWNED BY public.auth_tokens.id;


--
-- Name: authorization_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorization_codes (
    id integer NOT NULL,
    code character varying,
    client_id character varying,
    user_id uuid,
    email character varying,
    scopes character varying,
    redirect_uri character varying,
    expires_at timestamp without time zone,
    created_at timestamp without time zone
);


ALTER TABLE public.authorization_codes OWNER TO postgres;

--
-- Name: authorization_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authorization_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authorization_codes_id_seq OWNER TO postgres;

--
-- Name: authorization_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authorization_codes_id_seq OWNED BY public.authorization_codes.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid NOT NULL,
    name character varying
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid NOT NULL,
    name character varying,
    company_id uuid
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    "EtudeDocID" character varying,
    coordinating json,
    "isApproval" boolean,
    "DocInfo" json,
    created_at timestamp without time zone,
    owner_id uuid
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: oauth_clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_clients (
    id integer NOT NULL,
    client_id character varying,
    client_secret character varying,
    name character varying,
    redirect_uris character varying,
    allowed_scopes character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.oauth_clients OWNER TO postgres;

--
-- Name: oauth_clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.oauth_clients_id_seq OWNER TO postgres;

--
-- Name: oauth_clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_clients_id_seq OWNED BY public.oauth_clients.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token character varying,
    user_id uuid,
    email character varying,
    scopes character varying,
    client_id character varying,
    expires_at timestamp without time zone,
    created_at timestamp without time zone,
    revoked boolean
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying,
    org_email character varying,
    name character varying,
    surname character varying,
    patronymic character varying,
    "position" character varying,
    hashed_password character varying,
    "EtudeID" integer,
    department_id uuid,
    is_leader boolean NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: auth_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_tokens ALTER COLUMN id SET DEFAULT nextval('public.auth_tokens_id_seq'::regclass);


--
-- Name: authorization_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorization_codes ALTER COLUMN id SET DEFAULT nextval('public.authorization_codes_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: oauth_clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_clients ALTER COLUMN id SET DEFAULT nextval('public.oauth_clients_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
8bc3bd041347
\.


--
-- Data for Name: auth_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_tokens (id, code, email, scopes, client_id, redirect_uri, expires_at) FROM stdin;
\.


--
-- Data for Name: authorization_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authorization_codes (id, code, client_id, user_id, email, scopes, redirect_uri, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name) FROM stdin;
025e6529-1b34-496f-b868-63a2af0a70c4	ООО Технопрогресс
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, company_id) FROM stdin;
b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	ИТ Отдел	025e6529-1b34-496f-b868-63a2af0a70c4
22b6148c-4e73-41bb-aeb1-3274b47b6a4c	Бухгалтерия	025e6529-1b34-496f-b868-63a2af0a70c4
c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	Отдел разработки	025e6529-1b34-496f-b868-63a2af0a70c4
eadce39c-bace-47b6-b304-1f787286e8b2	Отдел продаж	025e6529-1b34-496f-b868-63a2af0a70c4
27ab34df-b5a2-4585-8888-bd6e5b9eadcf	Отдел маркетинга	025e6529-1b34-496f-b868-63a2af0a70c4
1716b0ad-4cbc-40d5-9918-3f93f275f563	Отдел кадров	025e6529-1b34-496f-b868-63a2af0a70c4
0d115e01-fa27-4222-a1c7-7b4d04e3d770	Юридический отдел	025e6529-1b34-496f-b868-63a2af0a70c4
60aa279f-ba07-4d4b-b89f-499e14a49fa4	Служба безопасности	025e6529-1b34-496f-b868-63a2af0a70c4
8611f392-da2e-4059-af0f-cb8bff17448a	Администрация	025e6529-1b34-496f-b868-63a2af0a70c4
9f403b76-0568-4101-a193-40b13a73ec46	Отдел логистики	025e6529-1b34-496f-b868-63a2af0a70c4
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, "EtudeDocID", coordinating, "isApproval", "DocInfo", created_at, owner_id) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_clients (id, client_id, client_secret, name, redirect_uris, allowed_scopes, created_at, updated_at) FROM stdin;
1	etude_backend_client	etude_backend_secret	Etude	http://localhost:5173	write	2025-05-14 01:28:44	2025-05-14 01:28:46
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token, user_id, email, scopes, client_id, expires_at, created_at, revoked) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, org_email, name, surname, patronymic, "position", hashed_password, "EtudeID", department_id, is_leader) FROM stdin;
46cce618-1a55-4b3b-82ac-2567e01296d5	head.it_otdel@techprogress.com	head.it_otdel@techprogress.com	Мечислав	Михеев	Устинович	Руководитель ИТ Отдела	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	t
c0d8e687-8ff1-40e2-97f4-b85bae8022ba	naina.shilova@techprogress.com	naina.shilova@techprogress.com	Наина	Шилова	Дмитриевна	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
152a029d-ce12-4131-b9c7-9520a7172b95	ustin.tretyakov@techprogress.com	ustin.tretyakov@techprogress.com	Устин	Третьяков	Терентьевич	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
9ba6d4d0-da2f-441a-ad41-6b89a307af38	konstantin.nikitin@techprogress.com	konstantin.nikitin@techprogress.com	Константин	Никитин	Данилович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
cfd44569-fd1a-4d55-8f0a-6a602ef35a01	valentin.dementev@techprogress.com	valentin.dementev@techprogress.com	Валентин	Дементьев	Ааронович	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
aaa527b8-d45f-4b3a-bf73-e48a5d02490a	demyan.uvarov@techprogress.com	demyan.uvarov@techprogress.com	Демьян	Уваров	Феоктистович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
5e805995-5453-4efa-a365-df330ae03fcf	petr.krylov@techprogress.com	petr.krylov@techprogress.com	Петр	Крылов	Якубович	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
54796218-e3ae-4ca3-bc4c-b55c61d54b19	galina.melnikova@techprogress.com	galina.melnikova@techprogress.com	Галина	Мельникова	Павловна	Дизайнер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
975258cc-f329-4a16-9bef-453cfbd133f5	kondratiy.maksimov@techprogress.com	kondratiy.maksimov@techprogress.com	Кондратий	Максимов	Феофанович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
56b2fc44-1495-4cb4-8c2e-0beac5969646	oksana.sharapova@techprogress.com	oksana.sharapova@techprogress.com	Оксана	Шарапова	Кирилловна	Бухгалтер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	b1e14c3a-2a98-4fea-b55f-1c5eef9c39ae	f
f199e59f-63ff-44fb-9622-350ca054039e	head.bukhgalteriya@techprogress.com	head.bukhgalteriya@techprogress.com	Василиса	Данилова	Аскольдовна	Руководитель Бухгалтерии	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	t
1488b0a2-c30e-4bbd-9e5a-23336ddb2d36	tikhon.pavlov@techprogress.com	tikhon.pavlov@techprogress.com	Тихон	Павлов	Елизарович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
4169a4b8-2b6d-4480-adad-ed07c4e665b8	stanislav.isaev@techprogress.com	stanislav.isaev@techprogress.com	Станислав	Исаев	Абрамович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
f9088171-326b-419c-9996-6dfb304ac2d5	agafya.kopylova@techprogress.com	agafya.kopylova@techprogress.com	Агафья	Копылова	Георгиевна	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
ab0ec147-7f65-449c-bd12-891076ca9fab	izot.gordeev@techprogress.com	izot.gordeev@techprogress.com	Изот	Гордеев	Зиновьевич	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
c06d4799-056a-46d0-95f2-345757fcf2d2	dementiy.kolesnikov@techprogress.com	dementiy.kolesnikov@techprogress.com	Дементий	Колесников	Евсеевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
5ddde959-b343-4fb0-9b25-ba6218102172	mikhail.evseev@techprogress.com	mikhail.evseev@techprogress.com	Михаил	Евсеев	Анисимович	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
9ea8bb3d-8e5c-47f5-9979-6399852bb576	mayya.sergeeva@techprogress.com	mayya.sergeeva@techprogress.com	Майя	Сергеева	Антоновна	Дизайнер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
6a993fdd-bba1-4d44-859c-e3b4c0a02e66	tit.schukin@techprogress.com	tit.schukin@techprogress.com	Тит	Щукин	Исидорович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
87a47b51-11b2-4182-a8e1-f8109df3e546	gostomysl.andreev@techprogress.com	gostomysl.andreev@techprogress.com	Гостомысл	Андреев	Аверьянович	Системный администратор	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	22b6148c-4e73-41bb-aeb1-3274b47b6a4c	f
bb5f418c-f5c8-4e83-99de-f19ea778e845	head.otdel_razrabotki@techprogress.com	head.otdel_razrabotki@techprogress.com	Агата	Мухина	Валериевна	Руководитель Отдела разработки	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	t
43e295d1-5320-4ea1-b5dd-b75940972695	fortunat.mishin@techprogress.com	fortunat.mishin@techprogress.com	Фортунат	Мишин	Александрович	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
c698b474-dd58-4402-813f-d9c27091671d	varlaam.likhachev@techprogress.com	varlaam.likhachev@techprogress.com	Варлаам	Лихачев	Ааронович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
3ad21020-3705-4b9d-9ade-dded16247923	andronik.orekhov@techprogress.com	andronik.orekhov@techprogress.com	Андроник	Орехов	Федосеевич	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
f302400e-7ab8-4190-aecc-dc414f8b081e	kupriyan.korolev@techprogress.com	kupriyan.korolev@techprogress.com	Куприян	Королев	Тихонович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
a878a472-2b6e-4543-b28b-cef31638af8e	anisim.suvorov@techprogress.com	anisim.suvorov@techprogress.com	Анисим	Суворов	Виленович	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
0d7ade12-2e36-4b64-bff7-06e553145374	nikifor.ovchinnikov@techprogress.com	nikifor.ovchinnikov@techprogress.com	Никифор	Овчинников	Дмитриевич	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
c9f30002-d505-4a6a-9c2d-bfc04a0eaba6	kirill.sazonov@techprogress.com	kirill.sazonov@techprogress.com	Кирилл	Сазонов	Андреевич	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
33303aff-d6e7-4a91-9657-2fa1bb46efdb	galaktion.stepanov@techprogress.com	galaktion.stepanov@techprogress.com	Галактион	Степанов	Тимурович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
cab7e388-0c60-40ad-a137-f44e25f1d298	nonna.avdeeva@techprogress.com	nonna.avdeeva@techprogress.com	Нонна	Авдеева	Владиславовна	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	c47d1a69-0e25-4970-b9bc-c2cddbe27ca7	f
e43bd010-d6bf-47db-bc7b-8a2e2e4c3425	head.otdel_prodazh@techprogress.com	head.otdel_prodazh@techprogress.com	Пахом	Медведев	Эдуардович	Руководитель Отдела продаж	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	t
40daf1db-d1dc-44a8-9bcb-e2c1bbed50e5	sofiya.noskova@techprogress.com	sofiya.noskova@techprogress.com	София	Носкова	Харитоновна	Дизайнер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
d7e53b0e-0507-4118-97e4-fa0e57b8f540	galina.zhukova@techprogress.com	galina.zhukova@techprogress.com	Галина	Жукова	Кузьминична	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
b390b65e-d734-41e3-b597-b19a352b7352	spartak.stepanov@techprogress.com	spartak.stepanov@techprogress.com	Спартак	Степанов	Валерьянович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
b8b2cd04-0c76-43ab-805a-ebf8621abcab	nadezhda.zinoveva@techprogress.com	nadezhda.zinoveva@techprogress.com	Надежда	Зиновьева	Тимофеевна	HR Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
fd280c3e-91a2-46f2-a7bc-7c2399e934cb	alla.ilina@techprogress.com	alla.ilina@techprogress.com	Алла	Ильина	Павловна	Дизайнер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
1c5c9d39-408d-43bc-82c6-1dabe95d24c4	yuriy.martynov@techprogress.com	yuriy.martynov@techprogress.com	Юрий	Мартынов	Евстигнеевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
1ce798e8-a126-45fa-9244-62a974114b14	vasiliy.sukhanov@techprogress.com	vasiliy.sukhanov@techprogress.com	Василий	Суханов	Тихонович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
0f70ac51-97eb-47f8-8fc6-b22719e6280f	marfa.grigoreva@techprogress.com	marfa.grigoreva@techprogress.com	Марфа	Григорьева	Наумовна	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
931ce15c-7016-45d9-8b87-dedec990acd7	zhanna.fokina@techprogress.com	zhanna.fokina@techprogress.com	Жанна	Фокина	Олеговна	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	eadce39c-bace-47b6-b304-1f787286e8b2	f
d5bee372-30ac-4130-8ceb-f936ad9febae	head.otdel_marketinga@techprogress.com	head.otdel_marketinga@techprogress.com	Мария	Лобанова	Сергеевна	Руководитель Отдела маркетинга	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	t
f0661b33-fec4-4108-8c13-7cb4685fb9bf	foma.vasilev@techprogress.com	foma.vasilev@techprogress.com	Фома	Васильев	Феоктистович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
3e05d7cd-f2c3-4086-ab96-aaa22b0bb395	makar.belyaev@techprogress.com	makar.belyaev@techprogress.com	Макар	Беляев	Елизарович	Системный администратор	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
4a5dd5be-9bb9-4ddb-9079-8c8999476c34	leontiy.kudryavtsev@techprogress.com	leontiy.kudryavtsev@techprogress.com	Леонтий	Кудрявцев	Фролович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
03cd19e0-5723-4173-91d8-04424ad4636d	regina.kozlova@techprogress.com	regina.kozlova@techprogress.com	Регина	Козлова	Леоновна	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
b8d9f663-9d4a-42dc-91a2-60ad717f9cd6	boleslav.kudryashov@techprogress.com	boleslav.kudryashov@techprogress.com	Болеслав	Кудряшов	Дмитриевич	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
95524fb8-1f9b-49fa-b69c-71de7a778aea	karp.samsonov@techprogress.com	karp.samsonov@techprogress.com	Карп	Самсонов	Харлампьевич	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
55ece766-833f-4a5c-bff4-d0b9fb23c732	prov.mamontov@techprogress.com	prov.mamontov@techprogress.com	Пров	Мамонтов	Герасимович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
072534d6-46e3-4504-9bbe-4c1aaa69d80a	amos.loginov@techprogress.com	amos.loginov@techprogress.com	Амос	Логинов	Венедиктович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
f4bae1c8-1487-41ba-8e10-4928c6ed24ee	roman.zakharov@techprogress.com	roman.zakharov@techprogress.com	Роман	Захаров	Изотович	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	27ab34df-b5a2-4585-8888-bd6e5b9eadcf	f
7c3e9a90-f8c3-451f-bdb4-f27d60310afd	head.otdel_kadrov@techprogress.com	head.otdel_kadrov@techprogress.com	Святополк	Сидоров	Тихонович	Руководитель Отдела кадров	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	t
f92b23a6-cd87-40b9-afc8-769a1d16cd4f	artemiy.vlasov@techprogress.com	artemiy.vlasov@techprogress.com	Артемий	Власов	Юльевич	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
f4286201-b833-4166-b738-c18de1af280a	marina.stepanova@techprogress.com	marina.stepanova@techprogress.com	Марина	Степанова	Тимофеевна	Бухгалтер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
5c5d9442-89fc-4feb-aac8-9a4566b52438	klavdiy.safonov@techprogress.com	klavdiy.safonov@techprogress.com	Клавдий	Сафонов	Федосеевич	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
8155ae1a-a56c-472a-98fe-346f91a7a51e	spiridon.zhdanov@techprogress.com	spiridon.zhdanov@techprogress.com	Спиридон	Жданов	Витальевич	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
cf64bf12-1a82-440f-9660-87d8978dac3d	leontiy.trofimov@techprogress.com	leontiy.trofimov@techprogress.com	Леонтий	Трофимов	Харлампович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
82ea65e4-56aa-41f0-9de3-196108409ef9	stanislav.terentev@techprogress.com	stanislav.terentev@techprogress.com	Станислав	Терентьев	Харлампьевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
df3a6402-897c-4ce7-accc-b49c9ab9b8c6	gedeon.dyachkov@techprogress.com	gedeon.dyachkov@techprogress.com	Гедеон	Дьячков	Арсеньевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
843590d8-0ce0-4451-8b3e-8ee5c634e140	aristarkh.ustinov@techprogress.com	aristarkh.ustinov@techprogress.com	Аристарх	Устинов	Валентинович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
7aa51374-d908-4a43-8c25-0a9f244705ab	mokey.artemev@techprogress.com	mokey.artemev@techprogress.com	Мокей	Артемьев	Яковлевич	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	1716b0ad-4cbc-40d5-9918-3f93f275f563	f
0061725f-7173-4e4e-91ee-6d7c2d9d0f42	head.yuridicheskiy_otdel@techprogress.com	head.yuridicheskiy_otdel@techprogress.com	Алина	Шубина	Даниловна	Руководитель Юридический отдела	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	t
ce00f263-adb9-4d50-b2ca-c71ce131da76	igor.markov@techprogress.com	igor.markov@techprogress.com	Игорь	Марков	Тарасович	Старший разработчик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
5619115b-753d-431d-9b39-1e0528472396	yaropolk.kopylov@techprogress.com	yaropolk.kopylov@techprogress.com	Ярополк	Копылов	Витальевич	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
6b12c252-24c2-4ef2-87c8-3d6816496741	svetlana.simonova@techprogress.com	svetlana.simonova@techprogress.com	Светлана	Симонова	Борисовна	Бухгалтер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
651c778f-bc25-48fc-8096-5f20d1c7fb75	tit.panfilov@techprogress.com	tit.panfilov@techprogress.com	Тит	Панфилов	Денисович	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
6c29497e-340d-4817-81c6-987427243b3d	nestor.nikolaev@techprogress.com	nestor.nikolaev@techprogress.com	Нестор	Николаев	Елизарович	Менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
a83d2197-0d9f-4f82-823f-6353b225830d	aleksandra.konovalova@techprogress.com	aleksandra.konovalova@techprogress.com	Александра	Коновалова	Вячеславовна	Бухгалтер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
abc77c0f-eb48-4c08-8755-c47d132a9ff3	emelyan.egorov@techprogress.com	emelyan.egorov@techprogress.com	Емельян	Егоров	Филиппович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
17c1161a-d6e5-4a4b-8300-2a02d8808706	denis.rozhkov@techprogress.com	denis.rozhkov@techprogress.com	Денис	Рожков	Аверьянович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
da09b8b7-8fc7-4b01-8687-024267191dd9	milovan.zhuravlev@techprogress.com	milovan.zhuravlev@techprogress.com	Милован	Журавлев	Харлампьевич	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	0d115e01-fa27-4222-a1c7-7b4d04e3d770	f
a6654932-a3ae-445f-a04c-baab6b7bd6cb	head.sluzhba_bezopasnosti@techprogress.com	head.sluzhba_bezopasnosti@techprogress.com	Самуил	Аксенов	Власович	Руководитель Службы безопасности	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	t
c6fe1e0f-bd06-444f-86bf-d3bbf1613ac7	vikentiy.danilov@techprogress.com	vikentiy.danilov@techprogress.com	Викентий	Данилов	Венедиктович	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
690059ee-85f5-497a-aefb-72333d1a758e	antonina.sharova@techprogress.com	antonina.sharova@techprogress.com	Антонина	Шарова	Владимировна	Дизайнер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
ee85663e-d70c-4a48-af44-ba29f9171b33	lavr.bobrov@techprogress.com	lavr.bobrov@techprogress.com	Лавр	Бобров	Ярославович	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
929655e5-d3b8-4ac7-9c2e-9cd2d97cc8de	kirill.samoylov@techprogress.com	kirill.samoylov@techprogress.com	Кирилл	Самойлов	Тимурович	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
e1cb8585-7f69-4390-92a0-afd3997f1e50	militsa.lobanova@techprogress.com	militsa.lobanova@techprogress.com	Милица	Лобанова	Алексеевна	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
96102018-cc39-4005-a69c-17a0a4a48526	akulina.mukhina@techprogress.com	akulina.mukhina@techprogress.com	Акулина	Мухина	Аркадьевна	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
bbbe55e8-a5c1-483b-8b91-f4af56245d36	erofey.petrov@techprogress.com	erofey.petrov@techprogress.com	Ерофей	Петров	Юльевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
c9966473-308f-490d-b2ee-30a33254e89d	faina.davydova@techprogress.com	faina.davydova@techprogress.com	Фаина	Давыдова	Петровна	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
90de2860-eefd-4ad3-9281-896418cab6d5	aristarkh.savelev@techprogress.com	aristarkh.savelev@techprogress.com	Аристарх	Савельев	Даниилович	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	60aa279f-ba07-4d4b-b89f-499e14a49fa4	f
34e768a0-bf8a-4585-a393-70ea2314fb28	head.administratsiya@techprogress.com	head.administratsiya@techprogress.com	Ираклий	Логинов	Федосьевич	Руководитель Администрации	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	t
58ad0951-7a5a-40d6-b037-0e785a821464	fedor.bykov@techprogress.com	fedor.bykov@techprogress.com	Федор	Быков	Якубович	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
c6eca976-3d8e-411c-b1e1-d537acda2ef6	elena.strelkova@techprogress.com	elena.strelkova@techprogress.com	Елена	Стрелкова	Кирилловна	Контент-менеджер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
b4c54aae-6616-4b9b-93cb-ea742fc5ac80	vladlen.zykov@techprogress.com	vladlen.zykov@techprogress.com	Владлен	Зыков	Бенедиктович	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
d87471ce-c351-4ad7-b961-511c6fdd5f8f	radovan.belozerov@techprogress.com	radovan.belozerov@techprogress.com	Радован	Белозеров	Федосеевич	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
160c0b32-06da-4161-894b-277f5ec71a9c	florentin.guschin@techprogress.com	florentin.guschin@techprogress.com	Флорентин	Гущин	Игоревич	Системный администратор	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
1ec97326-3da3-4fe8-92e8-0e253fa45cae	alevtina.filippova@techprogress.com	alevtina.filippova@techprogress.com	Алевтина	Филиппова	Борисовна	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
e897ee89-fa45-48c5-9426-666906cf8b19	faina.zimina@techprogress.com	faina.zimina@techprogress.com	Фаина	Зимина	Эльдаровна	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
1c9a9d55-7234-4d86-804c-1fe43d0b34e5	german.fedorov@techprogress.com	german.fedorov@techprogress.com	Герман	Федоров	Ануфриевич	Специалист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
7d2a2671-e270-4a03-8dda-325d779881f5	mariya.mukhina@techprogress.com	mariya.mukhina@techprogress.com	Мария	Мухина	Львовна	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	8611f392-da2e-4059-af0f-cb8bff17448a	f
c7b9ef20-27ef-4c31-b42d-ead9bb9854d4	head.otdel_logistiki@techprogress.com	head.otdel_logistiki@techprogress.com	Елена	Кудряшова	Никифоровна	Руководитель Отдела логистики	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	t
1cd98da7-05f3-4d80-93c0-f7f3b405d924	kondrat.naumov@techprogress.com	kondrat.naumov@techprogress.com	Кондрат	Наумов	Витальевич	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
c5109aeb-0a6e-408c-9e32-4cd76cb041af	vyacheslav.martynov@techprogress.com	vyacheslav.martynov@techprogress.com	Вячеслав	Мартынов	Игоревич	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
5778b96c-3531-4f65-8e1c-d36918376928	galaktion.safonov@techprogress.com	galaktion.safonov@techprogress.com	Галактион	Сафонов	Тимурович	Технический руководитель	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
975f4b61-ac50-41fc-9b0d-6296f4d164a8	ipat.grigorev@techprogress.com	ipat.grigorev@techprogress.com	Ипат	Григорьев	Тимурович	Аналитик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
a6301706-f7cd-4329-9795-61a923096c83	valentin.bobylev@techprogress.com	valentin.bobylev@techprogress.com	Валентин	Бобылев	Якубович	Старший разработчик	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
8284fe4a-4916-48a4-9897-89253fbfa70a	nikon.lavrentev@techprogress.com	nikon.lavrentev@techprogress.com	Никон	Лаврентьев	Геннадиевич	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
cfb13fea-699f-447e-93b5-919b33915fcd	praskovya.kharitonova@techprogress.com	praskovya.kharitonova@techprogress.com	Прасковья	Харитонова	Вадимовна	Инженер	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
f491bd1a-c4bc-484b-8cc1-2a29d0096c76	akulina.vasileva@techprogress.com	akulina.vasileva@techprogress.com	Акулина	Васильева	Антоновна	Консультант	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
23290240-305c-4d7a-beec-762d56b301b0	milen.blokhin@techprogress.com	milen.blokhin@techprogress.com	Милен	Блохин	Ерофеевич	Программист	9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08	\N	9f403b76-0568-4101-a193-40b13a73ec46	f
\.


--
-- Name: auth_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_tokens_id_seq', 1, true);


--
-- Name: authorization_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authorization_codes_id_seq', 1, false);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: oauth_clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_clients_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: auth_tokens auth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_pkey PRIMARY KEY (id);


--
-- Name: authorization_codes authorization_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorization_codes
    ADD CONSTRAINT authorization_codes_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_auth_tokens_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_auth_tokens_id ON public.auth_tokens USING btree (id);


--
-- Name: ix_authorization_codes_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_authorization_codes_code ON public.authorization_codes USING btree (code);


--
-- Name: ix_authorization_codes_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_authorization_codes_id ON public.authorization_codes USING btree (id);


--
-- Name: ix_companies_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_companies_id ON public.companies USING btree (id);


--
-- Name: ix_companies_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_companies_name ON public.companies USING btree (name);


--
-- Name: ix_departments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_departments_id ON public.departments USING btree (id);


--
-- Name: ix_departments_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_departments_name ON public.departments USING btree (name);


--
-- Name: ix_documents_EtudeDocID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ix_documents_EtudeDocID" ON public.documents USING btree ("EtudeDocID");


--
-- Name: ix_documents_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_documents_id ON public.documents USING btree (id);


--
-- Name: ix_oauth_clients_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_oauth_clients_client_id ON public.oauth_clients USING btree (client_id);


--
-- Name: ix_oauth_clients_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_oauth_clients_id ON public.oauth_clients USING btree (id);


--
-- Name: ix_refresh_tokens_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_refresh_tokens_id ON public.refresh_tokens USING btree (id);


--
-- Name: ix_refresh_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_refresh_tokens_token ON public.refresh_tokens USING btree (token);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_org_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_org_email ON public.users USING btree (org_email);


--
-- Name: authorization_codes authorization_codes_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorization_codes
    ADD CONSTRAINT authorization_codes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_clients(client_id);


--
-- Name: authorization_codes authorization_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorization_codes
    ADD CONSTRAINT authorization_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: departments departments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: documents documents_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: refresh_tokens refresh_tokens_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_clients(client_id);


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- PostgreSQL database dump complete
--

