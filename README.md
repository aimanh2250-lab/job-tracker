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