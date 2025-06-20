--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    email text,
    company text,
    linkedin text NOT NULL,
    tags text NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Contact" OWNER TO neondb_owner;

--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contact_id_seq" OWNER TO neondb_owner;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: Goal; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Goal" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    target_applications integer NOT NULL,
    target_followups integer NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Goal" OWNER TO neondb_owner;

--
-- Name: GoalProgress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."GoalProgress" (
    id integer NOT NULL,
    "goalId" integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    applications_made integer NOT NULL,
    followups_done integer NOT NULL
);


ALTER TABLE public."GoalProgress" OWNER TO neondb_owner;

--
-- Name: GoalProgress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."GoalProgress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GoalProgress_id_seq" OWNER TO neondb_owner;

--
-- Name: GoalProgress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."GoalProgress_id_seq" OWNED BY public."GoalProgress".id;


--
-- Name: Goal_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Goal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Goal_id_seq" OWNER TO neondb_owner;

--
-- Name: Goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Goal_id_seq" OWNED BY public."Goal".id;


--
-- Name: JobApplication; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."JobApplication" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text NOT NULL,
    pay text,
    "h1bSponsor" boolean NOT NULL,
    link text NOT NULL,
    status text NOT NULL,
    applied_date timestamp(3) without time zone,
    notes text,
    tags text[],
    resources text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    shared boolean DEFAULT false NOT NULL
);


ALTER TABLE public."JobApplication" OWNER TO neondb_owner;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."JobApplication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobApplication_id_seq" OWNER TO neondb_owner;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."JobApplication_id_seq" OWNED BY public."JobApplication".id;


--
-- Name: JobContact; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."JobContact" (
    id integer NOT NULL,
    "jobId" integer NOT NULL,
    "contactId" integer NOT NULL,
    relationship_note text
);


ALTER TABLE public."JobContact" OWNER TO neondb_owner;

--
-- Name: JobContact_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."JobContact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobContact_id_seq" OWNER TO neondb_owner;

--
-- Name: JobContact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."JobContact_id_seq" OWNED BY public."JobContact".id;


--
-- Name: Reminder; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Reminder" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "jobId" integer,
    "contactId" integer,
    title text NOT NULL,
    description text,
    frequency text NOT NULL,
    next_due_date timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Reminder" OWNER TO neondb_owner;

--
-- Name: Reminder_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Reminder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reminder_id_seq" OWNER TO neondb_owner;

--
-- Name: Reminder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Reminder_id_seq" OWNED BY public."Reminder".id;


--
-- Name: Resource; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Resource" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Resource" OWNER TO neondb_owner;

--
-- Name: Resource_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resource_id_seq" OWNER TO neondb_owner;

--
-- Name: Resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Resource_id_seq" OWNED BY public."Resource".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reminderDays" integer DEFAULT 2 NOT NULL
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: Goal id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Goal" ALTER COLUMN id SET DEFAULT nextval('public."Goal_id_seq"'::regclass);


--
-- Name: GoalProgress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GoalProgress" ALTER COLUMN id SET DEFAULT nextval('public."GoalProgress_id_seq"'::regclass);


--
-- Name: JobApplication id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobApplication" ALTER COLUMN id SET DEFAULT nextval('public."JobApplication_id_seq"'::regclass);


--
-- Name: JobContact id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobContact" ALTER COLUMN id SET DEFAULT nextval('public."JobContact_id_seq"'::regclass);


--
-- Name: Reminder id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Reminder" ALTER COLUMN id SET DEFAULT nextval('public."Reminder_id_seq"'::regclass);


--
-- Name: Resource id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Resource" ALTER COLUMN id SET DEFAULT nextval('public."Resource_id_seq"'::regclass);


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Contact" (id, "userId", name, email, company, linkedin, tags, notes, created_at) FROM stdin;
49	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Eli Howayeck		\N	https://www.linkedin.com/in/elihowayeck/		Director at Pepper Construction Wisconsin	2025-06-15 18:15:41.535
50	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Benjamin Gardner 		\N	https://www.linkedin.com/in/benjamin-gardner-lensa-fast-talent/		Business Development Manager at FastTalent & Career Advocate at Lensa	2025-06-15 18:25:35.108
51	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Zhuo Li		\N	https://www.linkedin.com/in/zhuo-li-4830a145/		Founder, embracing AI, producing film, protecting data\n	2025-06-15 18:34:00.619
52	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Victor Bian 		\N	https://www.linkedin.com/in/xiao-victor-bian-98368840/		COO at HydroX AI | AI Trust & Safety | Ex- Temasek, Intellectual Ventures, St. Jude	2025-06-15 18:34:35.756
53	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Brady Barksdale  		\N	https://www.linkedin.com/in/brady-barksdale/		Sales Leadership | Team Building | Player-Coach | MEDDICC | Force Management | SaaS |	2025-06-15 18:35:50.008
54	user_2xclD16jR5UrAxMtHBa2izc41Jy	c-haro		\N	https://www.linkedin.com/in/c-haro/		waiting for connecting	2025-06-16 01:18:33.132
70	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Robyn Hunter		\N	https://www.linkedin.com/in/robyn-hunter-8314801/	Vice President Talent Acquisition at BlackRock	Messaged in linkedin\n	2025-06-17 18:29:47.648
55	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Paridhi Khandelwal 		\N	https://www.linkedin.com/in/paridhikhandelwalds/			2025-06-17 00:59:55.79
30	user_2xclD16jR5UrAxMtHBa2izc41Jy	Autumn		\N	https://www.linkedin.com/in/autumn-moulder/	Engineering Leader	waiting for connection	2025-06-13 17:53:17.778
31	user_2xclD16jR5UrAxMtHBa2izc41Jy	nikhil		\N	http://localhost:3000/dashboard/jobs			2025-06-13 18:39:42.529
29	user_2xclD16jR5UrAxMtHBa2izc41Jy	Nithya		\N	https://www.linkedin.com/in/ngovi/	Member of Tech staff	waiting for connection	2025-06-13 07:38:58.697
39	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	swapnil-pillai		\N	https://www.linkedin.com/in/swapnil-pillai/			2025-06-14 07:26:16.431
40	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	carlos-garcia		\N	https://www.linkedin.com/in/-carlos-garcia/			2025-06-14 07:27:23.118
41	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Cyrus Saadat, PMP 		\N	https://www.linkedin.com/in/cyrus-saadat/			2025-06-15 00:23:03.047
42	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Logan Graham		\N	https://www.linkedin.com/in/grahamloganp/			2025-06-15 00:24:04.165
43	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	kiley-couch		\N	https://www.linkedin.com/in/kiley-couch-4a9a47/			2025-06-15 01:35:11.14
44	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	matthew-hinshaw		\N	https://www.linkedin.com/in/matthew-hinshaw-2a16a111/			2025-06-15 01:35:43.149
45	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Kathleen Hosko		\N	https://www.linkedin.com/in/kathleen-hosko-345baa88/		Senior Project Manager - MEP Coordinator at Pepper Construction Group	2025-06-15 18:10:17.082
46	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Ben Dykstra		\N	https://www.linkedin.com/in/ben-dykstra-b6358a33/		Vice President of Quality Management at Pepper Construction\n	2025-06-15 18:11:22.007
47	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Mary Sandner, PHR		\N	https://www.linkedin.com/in/mary-sandner/		HR Director @ Pepper Construction\n	2025-06-15 18:12:50.832
48	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Julie Kellman (Jessen) SHRM-SCP, SPHR, CCP		\N	https://www.linkedin.com/in/juliekellman1/		Vice President Human Resources at Pepper Construction Group\n	2025-06-15 18:14:19.387
57	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Praveena S		\N	https://www.linkedin.com/in/praveena-shrestha/			2025-06-17 01:02:01.897
58	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Narivi Roblero		\N	https://www.linkedin.com/in/narivi-roblero/			2025-06-17 01:02:53.178
59	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Briandra Lucas		\N	https://www.linkedin.com/in/briandra-lucas-mba-msol-6a4454122/		Talent Acquisition Specialist | Campus Recruiting | Recruitment Operations | DEI Champion	2025-06-17 01:30:10.655
60	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Tony Khazzam		\N	https://www.linkedin.com/in/tonykhazzam/		Managing Director at Bank of America	2025-06-17 01:31:31.033
61	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Corin Counihan		\N	https://www.linkedin.com/in/corin-counihan-6b2a0125/	Tech and Ops Recruiter at BlackRock	Tech and Ops Recruiter at BlackRock	2025-06-17 01:47:11.769
62	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Shruti Anil Narkhede		\N	https://www.linkedin.com/in/shruti-narkhede/		Senior Product Manager I @ BlackRock	2025-06-17 01:48:04.508
63	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Ramakrishna(Ramki) G.		\N	https://www.linkedin.com/in/gpallirk/	Vice President at BlackRock	Vice President at BlackRock	2025-06-17 01:49:03.819
64	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Karthik Anantha Prakash 		\N	https://www.linkedin.com/in/karthik-anantha-prakash-0b3136119/	Vice President at Blackrock	Vice President at Blackrock	2025-06-17 01:50:43.946
66	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Laura Ferrara		\N	https://www.linkedin.com/in/laura-modinger/	Talent Acquisition	Talent Acquisition	2025-06-17 01:53:24.782
67	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Cameron Merlino		\N	https://www.linkedin.com/in/cameron-merlino-122850221/	Recruiting Coordinator - Tech & Ops	Recruiting Coordinator - Tech & Ops	2025-06-17 01:54:20.607
56	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Monica Schmidt		\N	https://www.linkedin.com/in/meschmidt-swe/		Messaged via linkedIn	2025-06-17 01:00:51.045
68	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Ksenia Bannova 		\N	https://www.linkedin.com/in/ksenia-bannova-38371a22a/		Intern at Amorphyx	2025-06-17 03:19:48.855
69	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Ron VanOrden		\N	https://www.linkedin.com/in/ron-vanorden-a4a6039/	VP Operations at Amorphyx Inc.		2025-06-17 03:22:28.401
18	user_2xclD16jR5UrAxMtHBa2izc41Jy	Kevin		\N	https://www.linkedin.com/in/kevinluong96/	SE	waiting for connection	2025-06-13 04:26:59.837
38	user_2xclD16jR5UrAxMtHBa2izc41Jy	Dominic Bell		\N	https://www.linkedin.com/in/dominic-bell-a65200139/	SD	waiting for Referral	2025-06-13 19:20:08.394
72	user_2xclD16jR5UrAxMtHBa2izc41Jy	Michael Hutchinson		\N	https://www.linkedin.com/in/mikehutchinson/		need to ask for referral	2025-06-18 15:35:07.867
71	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Sumant Sarkar, PhD		\N	https://www.linkedin.com/in/ssarkar97/		Has referred me to  Sr. Computational Modeling Software Developer	2025-06-18 01:59:52.207
73	user_2xclD16jR5UrAxMtHBa2izc41Jy	maxton lenox		\N	https://www.linkedin.com/in/maxtonlenox/		need to ask for referral	2025-06-18 15:37:27.622
74	user_2xclD16jR5UrAxMtHBa2izc41Jy	Sherlyn Tan Meirun		\N	https://www.linkedin.com/in/sherlyn-tan-meirun/	connect		2025-06-18 15:45:50.757
75	user_2xclD16jR5UrAxMtHBa2izc41Jy	Malabica Mukherjee		\N	https://www.linkedin.com/in/malabica-mukherjee/	connect		2025-06-18 15:46:18.142
76	user_2xclD16jR5UrAxMtHBa2izc41Jy	chinmaya hardas		\N	https://www.linkedin.com/in/chinmayahardas/	connect		2025-06-18 15:46:54.228
77	user_2xclD16jR5UrAxMtHBa2izc41Jy	jin gaole		\N	https://www.linkedin.com/in/jingaole/	connect		2025-06-18 15:50:23.966
78	user_2xclD16jR5UrAxMtHBa2izc41Jy	Hao Jia		\N	https://www.linkedin.com/in/meethaojia/	connect		2025-06-18 15:52:16.244
79	user_2xclD16jR5UrAxMtHBa2izc41Jy	anurag-nampally		\N	https://www.linkedin.com/in/anurag-nampally/	connect		2025-06-18 15:54:02.677
80	user_2xclD16jR5UrAxMtHBa2izc41Jy	Madan Thangavelu		\N	https://www.linkedin.com/in/madanthangavelu/	connect		2025-06-18 16:51:38.386
81	user_2xclD16jR5UrAxMtHBa2izc41Jy	yeojin		\N	https://www.linkedin.com/in/yeojin-k-aa6651107/	connect		2025-06-18 16:52:34.521
82	user_2xclD16jR5UrAxMtHBa2izc41Jy	ganesan anand		\N	https://www.linkedin.com/in/ganesananand/	connect		2025-06-18 18:18:06.695
83	user_2xclD16jR5UrAxMtHBa2izc41Jy	krishna-yellamilli		\N	https://www.linkedin.com/in/krishna-yellamilli-97885118b/	connect		2025-06-18 18:18:39.463
84	user_2xclD16jR5UrAxMtHBa2izc41Jy	kanchan-sarkar		\N	https://www.linkedin.com/in/kanchan-sarkar-9888b853/	connect		2025-06-18 20:24:42.409
\.


--
-- Data for Name: Goal; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Goal" (id, "userId", type, target_applications, target_followups, start_date, end_date, created_at) FROM stdin;
\.


--
-- Data for Name: GoalProgress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."GoalProgress" (id, "goalId", date, applications_made, followups_done) FROM stdin;
\.


--
-- Data for Name: JobApplication; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."JobApplication" (id, "userId", title, company, location, pay, "h1bSponsor", link, status, applied_date, notes, tags, resources, created_at, shared) FROM stdin;
34	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software intern	Lensa			f	https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4251050950	Saved	\N		{""}	{""}	2025-06-15 03:37:01.965	f
36	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software Developer Intern - Summer 2025	pepperconstruction			f	https://jobs.dayforcehcm.com/en-US/pepperconstruction/CANDIDATEPORTAL/jobs/4708	Saved	\N	waiting on the linkedin request approval\n	{""}	{""}	2025-06-15 18:09:40.536	f
37	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software Engineer Co-op	Lensa			f	https://lensa.com/job-application-software-engineer-co-op-in-spring-valley-ny/cpc-jd-v3/0e667269ed37df7367e1f920c6eacb3ff490cb9633da3bf3cad583072c0a0255?tr=2a93461a7e7e48b8977efa137dd3ad1fincc1&utm_source=linkedin&utm_medium=slot&utm_campaign=Computer+Occupations&utm_term=jse	Applied	\N	waiting on the linkedin request approval	{""}	{""}	2025-06-15 18:25:02.691	f
38	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software Engineer Intern	HydroX AI			f	https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4248883397&discover=recommended&discoveryOrigin=MAIN_FEED_JYMBII&originToLandingJobPostings=4248936834%2C4251279448%2C4248883397%2C4249594929%2C4249518786	Saved	\N	waiting on the linkedin request approval	{""}	{""}	2025-06-15 18:33:25.143	f
27	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software Development Intern	Sandhills Global	Lincoln, Nebraska, USA	25	t	https://www.sandhills.com/careers-and-internships/details/careers/sandhills/1195/software-development-intern	Applied	2025-06-17 07:00:00	Applied with referral of Dominic	{""}	{""}	2025-06-13 18:20:53.169	f
43	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	software	lamresearch			f	https://careers.lamresearch.com/careers	Applied	\N		{""}	{""}	2025-06-18 01:58:55.687	f
29	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software Engineer - Co-op Program - Fall 2025	8451			f	https://job-boards.greenhouse.io/8451university/jobs/8028856002	Applied	\N	Should apply	{""}	{""}	2025-06-14 07:22:34.767	f
39	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software Developer Intern - Summer 2025	Pepper Construction	Barrington, IL 60010, USA		f	https://jobs.dayforcehcm.com/en-US/pepperconstruction/CANDIDATEPORTAL/jobs/4708?src=LinkedIn	Saved	\N	Need to apply\n	{""}	{""}	2025-06-16 01:16:31.076	f
40	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software analyst	Bank Of America			f	https://careers.bankofamerica.com/en-us/students/job-detail/12942/global-technology-summer-analyst-2026-software-engineer-multiple-locations-esomprank-jvtcxhka55-1	Saved	\N		{""}	{""}	2025-06-17 00:40:13.599	f
30	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	2025 Duolingo Tech Intern Meetup - Interest Form	Duolingo	Seattle		f	https://www.gem.com/form?formID=c92f43fc-165e-4012-a120-a3b171d17233	Applied	\N	Submitted, Event Dates\nNew York City - July 9 (6-9pm)\nSeattle - July 30 (6-9pm)\n	{""}	{""}	2025-06-14 07:57:03.058	f
41	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	2026 summer internship	blackrock			f	https://careers.blackrock.com/job/new-york/2026-summer-internship-program-amers/45831/78311026912	Saved	\N		{""}	{""}	2025-06-17 01:46:39.169	f
31	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Front end Engineer	Sauce Labs			f	https://saucelabs.com/company/careers/6978556	Applied	\N		{""}	{""}	2025-06-15 00:21:48.608	f
32	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	WhatNot	WhatNot			f	https://job-boards.greenhouse.io/whatnot/jobs/5562040004	Applied	\N		{""}	{""}	2025-06-15 01:25:27.42	f
33	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Software intern	CooperSurgical			f	https://hcjy.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/jobs/preview/7981/?keyword=Software+Engineer+Intern+%28SaaP%29&mode=location	Applied	\N		{""}	{""}	2025-06-15 01:31:00.249	f
42	user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	Relational database development	amorphyx			f	https://www.amorphyx.com/internships	Applied	\N		{""}	{""}	2025-06-17 03:18:44.222	f
35	user_2xclD16jR5UrAxMtHBa2izc41Jy	Summer Analyst's	GoldmanSachs	USA		f	https://higher.gs.com/campus?EDUCATION_LEVEL=Bachelors%20or%20Masters%20%28or%20equivalent%29|Bachelors%2C%20Masters%20or%20MBA%20%28or%20equivalent%29&EXPERIENCE_LEVEL=Summer%20Associate|Summer%20Analyst&LOCATION=Newport%20Beach|San%20Francisco|Miami|West%20Palm%20Beach|Atlanta|Chicago|Boston|Detroit|Albany|New%20York|Pittsburgh|Dallas|Houston|Salt%20Lake%20City|Seattle&graduationYear=2026-12-01&page=1&sort=RELEVANCE	Applied	2025-06-18 07:00:00	Applied!	{"Santhosh anna"}	{https://hdpc.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CampusHiring/my-profile}	2025-06-15 17:14:42.993	f
45	user_2xclD16jR5UrAxMtHBa2izc41Jy	INTERNSHIP - Software Engineer	Dassault Systems	United States, CA, San Diego		f	https://www.3ds.com/careers/jobs/internship-software-engineer-544334?src=SNS-102	Saved	\N	need to apply	{""}	{""}	2025-06-18 15:44:35.308	f
47	user_2xclD16jR5UrAxMtHBa2izc41Jy	2025 Fall Software Engineer Internship	Uber	US-CA-San Francisco		f	https://university-uber.icims.com/jobs/143882/job?mobile=false&width=1270&height=500&bga=true&needsRedirect=false&jan1offset=-480&jun1offset=-420	Saved	\N	need to apply	{""}	{""}	2025-06-18 16:51:00.235	f
48	user_2xclD16jR5UrAxMtHBa2izc41Jy	Spring 2026 Intern - Meshing	Ansys	Evanston, IL, US, 60201		f	https://careers.ansys.com/job/Evanston-Spring-2026-Intern-Meshing-%28MSPHD%29-IL-60201/1292622200/?utm_source=LINKEDIN&utm_medium=referrer	Saved	\N	need to apply	{""}	{""}	2025-06-18 18:16:54.289	f
18	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software Engineer Intern/Co-op (Fall 2025)	cohere	SF, CA		t	https://jobs.ashbyhq.com/cohere/b6c994c7-a435-4fd7-975b-4fb2e10a1a30/application?utm_source=jKNDxYPz51	Saved	2025-06-16 07:00:00	Applied with referral of Kevin	{""}	{""}	2025-06-13 05:51:21.043	f
44	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software Engineer Intern	Digital Dynamics	Scotts Valley, CA 95066		f	https://www.digitaldynamics.com/about/careers/	Applied	2025-06-18 07:00:00	applied!	{""}	{""}	2025-06-18 15:33:34.332	f
46	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software Engineer Intern (TikTok-Social-Product Innovation)	tik tok	San Jose		f	https://lifeattiktok.com/search/7514157460153895175?spread=5MWH5CQ	Applied	2025-06-19 07:00:00	applied! | referral code: 19PDEYP	{""}	{""}	2025-06-18 15:49:32.785	f
68	user_2xclD16jR5UrAxMtHBa2izc41Jy	software	lamresearch			f	https://careers.lamresearch.com/careers	Applied	\N		{""}	{""}	2025-06-19 15:40:02.847	t
69	user_2xclD16jR5UrAxMtHBa2izc41Jy	Software analyst	Bank Of America			f	https://careers.bankofamerica.com/en-us/students/job-detail/12942/global-technology-summer-analyst-2026-software-engineer-multiple-locations-esomprank-jvtcxhka55-1	Saved	\N		{""}	{""}	2025-06-19 15:40:02.848	t
70	user_2xclD16jR5UrAxMtHBa2izc41Jy	2026 summer internship	blackrock			f	https://careers.blackrock.com/job/new-york/2026-summer-internship-program-amers/45831/78311026912	Saved	\N		{""}	{""}	2025-06-19 15:40:02.849	t
71	user_2xclD16jR5UrAxMtHBa2izc41Jy	Relational database development	amorphyx			f	https://www.amorphyx.com/internships	Applied	\N		{""}	{""}	2025-06-19 15:40:02.849	t
\.


--
-- Data for Name: JobContact; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."JobContact" (id, "jobId", "contactId", relationship_note) FROM stdin;
12	18	29	\N
13	18	18	\N
14	18	30	\N
15	27	38	\N
16	29	39	\N
17	29	40	\N
18	31	41	\N
19	31	42	\N
20	33	43	\N
21	33	44	\N
22	36	45	\N
23	36	46	\N
24	36	47	\N
25	36	48	\N
26	36	49	\N
27	37	50	\N
28	38	51	\N
29	38	52	\N
30	38	53	\N
31	39	54	\N
32	40	55	\N
33	40	56	\N
34	40	57	\N
35	40	58	\N
36	40	59	\N
37	40	60	\N
38	41	61	\N
39	41	62	\N
40	41	63	\N
41	41	64	\N
43	41	66	\N
44	41	67	\N
45	42	68	\N
46	42	69	\N
47	41	70	\N
48	43	71	\N
49	44	72	\N
50	44	73	\N
51	45	74	\N
52	45	75	\N
53	45	76	\N
54	46	77	\N
55	46	78	\N
56	46	79	\N
57	47	80	\N
58	47	81	\N
59	48	82	\N
60	48	83	\N
61	46	84	\N
\.


--
-- Data for Name: Reminder; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Reminder" (id, "userId", "jobId", "contactId", title, description, frequency, next_due_date, status, created_at) FROM stdin;
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Resource" (id, "userId", label, url, note, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, email, password_hash, name, created_at, "reminderDays") FROM stdin;
user_2yUNvcFe6LWAv5qIyvoRoVKs5xU	gangiswathi30@gmail.com	\N	gangi swathi	2025-06-14 07:22:34.175	2
user_2xclD16jR5UrAxMtHBa2izc41Jy	nikhilgattu16@gmail.com	\N	Gattu Nikhil	2025-06-12 07:39:24.34	1
user_2yOfocZSrOjLC1pmyygQJ8qTXap	vinaygattu005@gmail.com	\N	Vinay Kumar	2025-06-19 07:19:44.549	2
user_2yiXWDWbjEy3Rbjm7S1QXefey8L	gangiswathi2000@gmail.com	\N	swathi	2025-06-19 07:57:37.462	2
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
fc511fb7-5bb7-48ca-8aa0-30c0042026d1	8df80007254c19eb05e97476124d978d5d6fabacc1fa212ad94a50ed7ec4cddb	2025-06-12 07:38:51.560433+00	20250612073825_make_email_optional	\N	\N	2025-06-12 07:38:50.975299+00	1
91fbd3ea-4bad-4651-9140-ad3622acc37a	2f293ddde30fcc9cc324ae181ea8faec1c0ddcb998da0444c770f88b42be0197	2025-06-13 22:37:31.452402+00	20250613223725_add_reminder_days	\N	\N	2025-06-13 22:37:30.826466+00	1
\.


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 84, true);


--
-- Name: GoalProgress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."GoalProgress_id_seq"', 1, false);


--
-- Name: Goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Goal_id_seq"', 1, false);


--
-- Name: JobApplication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."JobApplication_id_seq"', 71, true);


--
-- Name: JobContact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."JobContact_id_seq"', 61, true);


--
-- Name: Reminder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Reminder_id_seq"', 1, false);


--
-- Name: Resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Resource_id_seq"', 2, true);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: GoalProgress GoalProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GoalProgress"
    ADD CONSTRAINT "GoalProgress_pkey" PRIMARY KEY (id);


--
-- Name: Goal Goal_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Goal"
    ADD CONSTRAINT "Goal_pkey" PRIMARY KEY (id);


--
-- Name: JobApplication JobApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_pkey" PRIMARY KEY (id);


--
-- Name: JobContact JobContact_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobContact"
    ADD CONSTRAINT "JobContact_pkey" PRIMARY KEY (id);


--
-- Name: Reminder Reminder_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Reminder"
    ADD CONSTRAINT "Reminder_pkey" PRIMARY KEY (id);


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Contact Contact_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GoalProgress GoalProgress_goalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GoalProgress"
    ADD CONSTRAINT "GoalProgress_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES public."Goal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Goal Goal_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Goal"
    ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobApplication JobApplication_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobContact JobContact_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobContact"
    ADD CONSTRAINT "JobContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobContact JobContact_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."JobContact"
    ADD CONSTRAINT "JobContact_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."JobApplication"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reminder Reminder_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Reminder"
    ADD CONSTRAINT "Reminder_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reminder Reminder_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Reminder"
    ADD CONSTRAINT "Reminder_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."JobApplication"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reminder Reminder_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Reminder"
    ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Resource Resource_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

