# Job Application Tracker

A full-stack web app that helps job seekers keep track of their job applications from different sites (LinkedIn, JobStreet and others) in one place.

## Features
- Register and log in securely (JWT login, passwords stored as BCrypt hashes)
- Add, edit and delete job applications (company, status, role, applied date and notes)
- Search by company or role, filter by status, sort by date or company, and move between pages
- Upload a resume for each application (PDF or DOCX, max 5 MB) and download it later
- Each user can only see their own jobs
- Clear error messages when something goes wrong (for example: "Email is already registered" or "Only PDF or DOCX files are allowed")
- Important actions are written to a log file
- Tests run automatically on every push with GitHub Actions
- Starts with one command using Docker Compose
- Responsive layout that works on phone and desktop

## Tech stack
| Part | Tools |
|---|---|
| Backend | Java 21, Spring Boot 4.1.1, Spring Security 7.1.1 (JWT), Spring Data JPA / Hibernate 7.4, Bean Validation |
| Frontend | React 19.3, TypeScript 6.0, Vite 8.3, React Router 8.4, Tailwind CSS 4.3 |
| Database | PostgreSQL 17 |
| DevOps / testing | Docker Compose, nginx, GitHub Actions, JUnit 6 + Mockito |

## How to run (Docker)
You only need Docker. Docker builds the Java and React parts for you.

1. Download the code:
   ```bash
   git clone https://github.com/aimanh2250-lab/job-tracker.git
   cd job-tracker
   ```
2. Create your `.env` file with a secret key:
   ```bash
   cp .env.example .env
   openssl rand -base64 32
   ```
   Paste the key after JWT_SECRET= in .env
   On Windows PowerShell (no openssl), make the key with:
   ```powershell
   $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
   ```
3. Start everything:
   ```bash
   docker compose up --build
   ```
4. Open http://localhost:5173, register an account, then log in.
5. To stop: `docker compose down` (add `-v` to also delete all saved data).

## Run without Docker (for development)
You need Java 21, Node 24 and PostgreSQL 17 (or use the database command below), plus the same .env file.

- Database:
  `docker run -d --name jobtracker-db -e POSTGRES_DB=jobtracker -e POSTGRES_USER=jobtracker -e POSTGRES_PASSWORD=jobtracker -p 5432:5432 postgres:17`
- Backend (port 8080): `cd backend` then `./mvnw spring-boot:run`
- Frontend (port 5173): `cd frontend` then `npm install` then `npm run dev`

## Run the tests
`cd backend` then `./mvnw test`. The startup test needs the database running and the .env file.

## Project structure
```
job-tracker/
├── backend/                  Spring Boot REST API
│   └── src/main/java/com/aiman/jobtracker/
│       ├── controller/       handles HTTP requests and responses
│       ├── service/          business rules and owner checks
│       ├── repository/       saves and loads data (Spring Data JPA)
│       ├── entity/           database tables as Java classes
│       ├── dto/              what goes in and out between browser and app
│       ├── config/           security rules, JWT, CORS, password hashing
│       └── exception/        catches errors from all controllers
├── frontend/                 React app
│   └── src/                  pages/ = screens, api.ts = talks to the backend, types.ts = data shapes
├── docs/design.md            database tables and API endpoints
├── compose.yaml              starts database, backend and frontend
└── .github/workflows/        runs the backend tests on every push
```

### How a request flows
browser → api.ts adds the token → controller → service → repository → PostgreSQL

The database tables and the full API list are in [docs/design.md](docs/design.md).

## Design decisions
| Decision | Why | Trade-off |
|---|---|---|
| JWT login (1 hour, no server sessions) | Backend stays stateless; fits a separate frontend | a token can't be cancelled early; it lives until it expires |
| Token kept in localStorage | Simplest with fetch: read it before each request | JavaScript can read it; an httpOnly cookie would be safer |
| Another user's job returns 404, not 403 | Hides whether resources exist | — |
| Same 401 message for wrong email and wrong password | Prevents revealing account information | — |
| `ddl-auto=update` instead of Flyway | Quick for a small project, no migration files | no version history of database changes |
| Packages by layer | Organizes code by technical responsibility | in a big app, one feature is spread over many folders |
| Resumes saved on disk with server-made names | Prevents filename conflicts and attacks | needs a disk/volume; cloud storage would scale better |
| Service tests with Mockito (no database) | Tests business logic without databases | they don't test the SQL queries or controllers |
| JWT key in `.env`, not in the code | Keeps secret keys outside source code | the reviewer has to create the key once |

## What I'd improve
- show an error message when the server can’t be reached (right now the list just stays empty)
- use an httpOnly cookie + refresh tokens instead of localStorage, so logout can cancel a token
- add more tests: controller tests (MockMvc), database tests (Testcontainers), frontend tests
- delete the old resume file when it’s replaced or the job is deleted (right now old files stay on disk)
- check the file’s real content, not only the type the browser says it is

## AI usage
The assessment allows AI for guidance and research only. I used Claude (Anthropic) as a tutor and code reviewer. I typed the project code myself and made the design choices. AI explained concepts, pointed me to documentation, reviewed my code line by line, and tested tricky setups in separate practice projects before I used them.

- **10 Oct, planning:** AI helped me choose the app idea and a 14-day plan, gave install commands (JDK 21, IntelliJ) and Spring Initializr settings, and explained Conventional Commits.
- **10 Oct, design:** AI showed a worked example for a different app (a library). I then picked my tables, status type, resume storage, API query options, `ddl-auto` and packages by layer from 2-option choices, and AI wrote my picks into `docs/design.md`.
- **10–11 Oct, entities, repositories, register:** written by me using generic "library" examples, the Spring guide "Accessing Data with JPA" and Baeldung; AI reviewed every line.
- **11–12 Oct, JWT login:** I chose Spring's built-in resource server over jjwt. The security setup comes from the Spring Security docs ("Default JWT Configuration", "Trusting a Single Symmetric Key"); AI gave a generic example for the token encoder, tested the setup first and warned me about 2 traps (HS256 header, permitting `/error`).
- **12–13 Oct, job CRUD + search:** for the first JobService methods AI gave fill-in-the-blank shapes; after that we switched to plain explanations plus examples from other topics. The search query is based on the Spring Data JPA docs; AI found a PostgreSQL null-search problem in a practice database first.
- **13 Oct, error handling and CORS:** global error handler: standard ProblemDetail pattern suggested by my AI tutor, checked against the Spring "Error Responses" docs (RFC 9457). AI tested that the CORS docs example also needs allowed headers.
- **13–18 Oct, frontend:** concepts explained step by step; I used MDN "Using the Fetch API", react.dev, React Router, Tailwind and HyperUI; AI reviewed each step.
- **18–19 Oct, resume upload/download:** AI explained multipart uploads and blob downloads and found that the download sent the wrong file type.
- **19 Oct, logging, tests, CI, Docker, secrets:** AI pointed me to the docs (SLF4J, reflectoring.io, JUnit, Mockito, GitHub Actions, Docker, an nginx guide), gave file outlines with blanks, and tested the Docker setup first. When I was stuck, AI pasted the exact docs examples for me to adapt. AI also guided moving the JWT key into `.env` and GitHub Secrets.
- **20 Oct, clean-up and README:** AI scanned my code for wrong comments and unused files. For this README, AI gave the outline (some parts as fill-in templates), the version numbers, run commands and plain explanations of my design choices; I filled them in and AI corrected the wording.