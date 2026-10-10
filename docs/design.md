\* Design Architechure

users

\- id: number, auto

\- email: text, required, unique

\- password\_hash: text, required

\- created\_at: date-time, auto



job\_application

\- id: number, auto

\- user\_id: number, required       <- owner (links to users.id)

\- company: text, required

\- role: text, required

\- applied\_date: date, required    <- your "date", renamed to be clear

\- status: one of APPLIED / INTERVIEW / OFFER / REJECTED, required

\- notes: long text, optional

\- resume\_path: text, optional     <- the file itself lives on disk



\* List API endpoints

POST   /api/auth/register

POST   /api/auth/login              -> returns a login token (JWT)

GET    /api/jobs?q=\&status=\&page=0\&size=10\&sort=appliedDate,desc

GET    /api/jobs/{id}

POST   /api/jobs

PUT    /api/jobs/{id}

DELETE /api/jobs/{id}

POST   /api/jobs/{id}/resume

GET    /api/jobs/{id}/resume



1\) q searches company and role.

2\) status is one of the 4 values; leave it empty to see all.

3\) sort is appliedDate or company, followed by ,asc or ,desc. The default is newest first.

4\) page, size and sort are Spring’s own standard names, so Spring reads them for you with no extra code.

5\) It’s appliedDate, not applied\_date, because Java names use capitals instead of underscores. The database column stays applied\_date.

