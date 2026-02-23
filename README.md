# DevTrack AI 🚀

> **A developer productivity tracker for your portfolio** — manage projects, track tasks, log study sessions, and visualise your progress with a personal dashboard.

[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

## What is DevTrack AI?

DevTrack AI lets a developer:

- ✅ **Register / Login** with JWT authentication
- 📁 **Create and manage Projects** (status: IDEA → ACTIVE → DONE)
- ✔️ **Create and manage Tasks** per project (TODO / DOING / DONE)
- 📖 **Log Study Sessions** with duration and optional project tag
- 📊 **View a Dashboard** with weekly study minutes, task stats, and study streak

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA |
| Auth | JWT (JJWT 0.12), BCrypt |
| Database | MySQL 8 |
| API Docs | Springdoc OpenAPI 3 (Swagger UI) |
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS *(Sprint 2)* |
| Build | Maven (backend), npm (frontend) |

---

## Project Structure

```
DevTrack/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/devtrackai/
│   │   ├── config/             # Security, Swagger
│   │   ├── auth/               # Register, Login, JWT
│   │   ├── users/              # User entity + repository
│   │   ├── projects/           # (Sprint 2)
│   │   ├── tasks/              # (Sprint 2)
│   │   ├── studysessions/      # (Sprint 2)
│   │   ├── dashboard/          # (Sprint 2)
│   │   └── common/             # Error handling, shared DTOs
│   └── src/test/
├── frontend/                   # React + Vite (Sprint 2)
├── docs/
│   ├── ERD.md                  # Entity-Relationship Diagram
│   ├── API.md                  # Endpoint reference
│   ├── DECISIONS.md            # Technical decisions log
│   └── sql/
│       ├── schema.sql          # DDL for all tables
│       └── seed.sql            # Demo data
└── README.md
```

---

## Getting Started

### Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **MySQL 8+** running locally

### 1. Database Setup

```sql
CREATE DATABASE devtrack_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Database Credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**

### 4. Open Swagger UI

👉 **http://localhost:8080/swagger-ui.html**

1. Call `POST /api/auth/register` to create a user
2. Call `POST /api/auth/login` to get your JWT
3. Click **Authorize 🔓** and paste `Bearer <your-token>`

### 5. Run Tests

```bash
cd backend
mvn test
```

---

## API Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | ❌ | Create account |
| `/api/auth/login` | POST | ❌ | Get JWT token |
| `/api/projects` | GET/POST | ✅ | List/create projects |
| `/api/projects/{id}/tasks` | GET/POST | ✅ | Task management |
| `/api/study-sessions` | GET/POST | ✅ | Log study time |
| `/api/dashboard/summary` | GET | ✅ | Stats & streak |

Full reference → [docs/API.md](docs/API.md)

---

## Screenshots

> *Dashboard and project views coming in Sprint 2*

| | |
|--|--|
| ![Swagger UI](docs/screenshots/swagger-placeholder.png) | ![Dashboard](docs/screenshots/dashboard-placeholder.png) |
| Swagger UI (Auth endpoints) | Dashboard (Sprint 2) |

---

## Roadmap

### ✅ Sprint 1 — Foundation
- [x] Maven project with Spring Boot 3.4
- [x] JWT Auth (register / login)
- [x] Swagger UI with examples
- [x] Global error handling
- [x] Unit tests for AuthService
- [x] SQL schema + seed data

### 🔄 Sprint 2 — Core Features *(next)*
- [ ] Projects CRUD API
- [ ] Tasks CRUD API (with status patch)
- [ ] Study Sessions API
- [ ] Dashboard summary endpoint
- [ ] React + Vite frontend

### 🔮 Sprint 3 — Polish
- [ ] Frontend deployment (Netlify/Vercel)
- [ ] Backend deployment (Railway/Render)
- [ ] Flyway migrations (replace ddl-auto)
- [ ] AI study suggestions

---

## Security Notes

- Passwords are stored as **BCrypt hashes** — never plain text
- JWT tokens are signed with **HMAC-SHA256**
- Every protected endpoint verifies the user owns the resource
- Change `app.jwt.secret` in `application.properties` before any deployment

---

## License

MIT — see [LICENSE](LICENSE) for details.
