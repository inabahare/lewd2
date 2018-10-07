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
-- Name: Transparency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transparency" (
    "Date" date,
    "FileName" character varying(255),
    "FileHash" character varying(255),
    "Type" character varying(255),
    "Origin" character varying(255)
);


ALTER TABLE public."Transparency" OWNER TO postgres;

--
-- Name: Uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Uploads" (
    id serial NOT NULL,
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
    "scannedTwice" boolean DEFAULT false,
    "virustotalOne" boolean DEFAULT false,
    "virustotalTwo" boolean DEFAULT false,
    "virustotalThree" boolean DEFAULT false
);


ALTER TABLE public."Uploads" OWNER TO postgres;

--
-- Name: COLUMN "Uploads".size; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Uploads".size IS 'Size in bytes';

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id serial NOT NULL,
    username character varying(255),
    password character varying(255),
    token character varying(255),
    roleid smallint,
    uploadsize integer,
    isadmin boolean DEFAULT false
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Data for Name: LoginTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoginTokens" (token, registered, userid) FROM stdin;
\.


--
-- Data for Name: RegisterTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RegisterTokens" (token, registered, used, roleid, uploadsize, isadmin) FROM stdin;
\.


--
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, name, uploadsize) FROM stdin;
\.


--
-- Data for Name: Transparency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transparency" ("Date", "FileName", "FileHash", "Type", "Origin") FROM stdin;
\.


--
-- Data for Name: Uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Uploads" (id, filename, userid, uploaddate, filesha, deleted, duplicate, originalname, virus, passworded, deletionkey, size, "scannedTwice", "virustotalOne", "virustotalTwo", "virustotalThree") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, password, token, roleid, uploadsize, isadmin) FROM stdin;
0	null	default	default	0	280000000	f
1	UserName	PasswordHashed	YourToken	3	1000000000	t
\.

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

