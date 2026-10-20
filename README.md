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