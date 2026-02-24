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
- ✔️ **Create and manage Tasks** per project (TODO / DOING / DONE, inline status change)
- 📖 **Log Study Sessions** with duration and optional project tag
- 📊 **View a Dashboard** with weekly study chart, task stats, and study streak
- 🌐 **Bilingual UI** — English / Spanish toggle

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA |
| Auth | JWT (JJWT 0.12), BCrypt |
| Database | MySQL 8 |
| API Docs | Springdoc OpenAPI 3 (Swagger UI) |
| Frontend | React 18, Vite 6, React Router 6, Axios, Tailwind CSS 3, Recharts |
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
│   │   ├── projects/           # Projects CRUD
│   │   ├── tasks/              # Tasks CRUD + status patch
│   │   ├── studysessions/      # Study sessions CRUD
│   │   ├── dashboard/          # Aggregated stats
│   │   └── common/             # Error handling, shared DTOs
│   └── src/test/
├── frontend/                   # React + Vite SPA
│   └── src/
│       ├── pages/              # Login, Dashboard, Projects, ProjectDetail, StudySessions
│       ├── components/         # Navbar, LanguageToggle
│       ├── context/            # AuthContext, I18nContext
│       ├── i18n/               # EN + ES translations
│       ├── utils/              # apiError helper
│       └── api.js              # Axios instance + interceptors
├── docs/
│   ├── ERD.md
│   ├── API.md
│   ├── DECISIONS.md
│   └── sql/
│       ├── schema.sql
│       └── seed.sql
└── README.md
```

---

## Getting Started

### Prerequisites

- **Java 17+** · **Maven 3.8+** · **MySQL 8+** · **Node.js 18+**

### 1. Database

```sql
CREATE DATABASE devtrack_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```
API → **http://localhost:8080** · Swagger → **http://localhost:8080/swagger-ui.html**

### 4. Run the frontend

```bash
cd frontend
npm install      # only needed once
npm run dev
```
Frontend → **http://localhost:5173** (proxies `/api` → backend automatically)

### 5. Run tests

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
| `/api/projects` | GET / POST | ✅ | List / create projects |
| `/api/projects/{id}` | GET / PUT / DELETE | ✅ | Manage single project |
| `/api/projects/{id}/tasks` | GET / POST | ✅ | Task management |
| `/api/tasks/{id}` | PUT / DELETE | ✅ | Update / delete task |
| `/api/tasks/{id}/status` | PATCH | ✅ | Quick status change |
| `/api/study-sessions` | GET / POST | ✅ | Log study time |
| `/api/dashboard/summary` | GET | ✅ | Stats & streak |

Full reference → [docs/API.md](docs/API.md)

---

## Roadmap

### ✅ Sprint 1 — Foundation
- [x] Maven project with Spring Boot 3.4
- [x] JWT Auth (register / login)
- [x] Swagger UI with examples
- [x] Global error handling (@ControllerAdvice)
- [x] Unit tests for AuthService (5 tests, Mockito)
- [x] SQL schema + seed data
- [x] ERD, API reference, DECISIONS docs

### ✅ Sprint 2 — Core Features
- [x] Projects CRUD API + per-user ownership
- [x] Tasks CRUD API (with PATCH /status)
- [x] Study Sessions API
- [x] Dashboard summary (streak algorithm + weekly chart)
- [x] React + Vite + Tailwind frontend
- [x] Login / Register page
- [x] Dashboard page with Recharts bar chart
- [x] Projects list + create/edit modal
- [x] Project detail with inline Kanban status change
- [x] Study sessions log + history
- [x] Axios JWT interceptor (auto-attach + 401 redirect)
- [x] EN / ES i18n toggle

### 🔮 Sprint 3 — Polish
- [ ] Frontend deployment (Netlify / Vercel)
- [ ] Backend deployment (Railway / Render)
- [ ] Flyway DB migrations (replace `ddl-auto=update`)
- [ ] Refresh token support
- [ ] AI study suggestions

---

## Security Notes

- Passwords stored as **BCrypt hashes** — never plain text
- JWT tokens signed with **HMAC-SHA256**
- Every protected endpoint verifies the user owns the resource
- Change `app.jwt.secret` before any production deployment

---

## License

MIT — see [LICENSE](LICENSE) for details.
