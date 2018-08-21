--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5 (Ubuntu 10.5-0ubuntu0.18.04)
-- Dumped by pg_dump version 10.5 (Ubuntu 10.5-0ubuntu0.18.04)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: LoginTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoginTokens" (
    token character varying(255),
    registered timestamp(6) without time zone,
    userid integer
);


ALTER TABLE public."LoginTokens" OWNER TO postgres;

--
-- Name: RegisterTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RegisterTokens" (
    token character varying(255) NOT NULL,
    registered timestamp(0) without time zone DEFAULT now() NOT NULL,
    used boolean DEFAULT false,
    roleid integer DEFAULT 0 NOT NULL,
    uploadsize integer NOT NULL,
    isadmin boolean DEFAULT false
);


ALTER TABLE public."RegisterTokens" OWNER TO postgres;

--
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    id integer NOT NULL,
    name character varying(255),
    uploadsize bigint DEFAULT 134200000
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- Name: Uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Uploads" (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    userid integer NOT NULL,
    uploaddate timestamp(6) without time zone DEFAULT now(),
    filesha character varying(255),
    deleted boolean DEFAULT false NOT NULL,
    duplicate boolean DEFAULT false NOT NULL,
    originalname character varying(255) NOT NULL,
    virus boolean DEFAULT false,
    passworded boolean DEFAULT false,
    deletionkey character varying(255),
    size integer,
    "scannedTwice" boolean DEFAULT false
);


ALTER TABLE public."Uploads" OWNER TO postgres;

--
-- Name: COLUMN "Uploads".size; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Uploads".size IS 'Size in bytes';


--
-- Name: Uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Uploads_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Uploads_id_seq" OWNER TO postgres;

--
-- Name: Uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Uploads_id_seq" OWNED BY public."Uploads".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255),
    password character varying(255),
    token character varying(255),
    roleid smallint,
    uploadsize integer,
    isadmin boolean DEFAULT false
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Uploads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Uploads" ALTER COLUMN id SET DEFAULT nextval('public."Uploads_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);





--
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, name, uploadsize) FROM stdin;
2	approved	5369000000
3	admin	10740000000
0	default	134200000
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, password, token, roleid, uploadsize, isadmin) FROM stdin;
0	null	default	default	0	280000000	f
1	USERNAME_HERE	PASSWORD_HERE	TOKEN_HERE	3	1000000000	t
\.


--
-- Name: Uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Uploads_id_seq"', 1295, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 7, true);


--
-- Name: Uploads Uploads_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Uploads"
    ADD CONSTRAINT "Uploads_id_key" UNIQUE (id);


--
-- Name: Uploads Uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Uploads"
    ADD CONSTRAINT "Uploads_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

