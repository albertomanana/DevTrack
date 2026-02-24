# Technical Decisions — DevTrack AI

A living log of architectural and library decisions made during development.

---

## 001 — JWT Library: JJWT 0.12 (io.jsonwebtoken)

**Decision**: Use `io.jsonwebtoken` (JJWT) version 0.12.x.

**Alternatives considered**:
- `nimbus-jose-jwt` — more powerful but heavier and more complex for a portfolio project.
- Spring's own `spring-security-oauth2-resource-server` — overkill for a standalone JWT without an authorization server.

**Rationale**: JJWT is the de-facto standard for Spring Boot JWT auth, actively maintained, and its 0.12 API is cleaner and type-safe. Zero exotic dependencies.

---

## 002 — Spring Security Principal = Email (not username)

**Decision**: `UserDetails.getUsername()` returns the user's **email**, not their display username.

**Rationale**: Email is unique and used for login. The display `username` is a mutable, human-friendly alias. Using email as the JWT subject avoids stale token issues if a user renames themselves.

---

## 003 — JWT Storage on the Frontend: localStorage

**Decision**: Store JWT in `localStorage` on the frontend.

**Alternatives considered**:
- `httpOnly` cookie — more secure against XSS but requires CSRF protection and extra backend cookie config.
- In-memory (React state) — safest against XSS but token is lost on page refresh, requiring re-login UX.

**Rationale**: For a portfolio project, `localStorage` is the pragmatic choice. A XSS note is documented in the README. Can be upgraded to httpOnly cookies in v2.

---

## 004 — `project_id` Nullable FK on StudySession

**Decision**: `StudySession.project_id` is nullable.

**Rationale**: Users may study general topics (algorithms, reading, etc.) not tied to any specific project. Forcing a project association would create artificial dummy projects. Nullable FK keeps data honest.

---

## 005 — `ddl-auto=update` in Development

**Decision**: Use `spring.jpa.hibernate.ddl-auto=update` during development only.

**Rationale**: Speeds up iteration — no manual migration scripts needed for schema tweaks. For staging/production, this would be replaced with `validate` + Flyway or Liquibase migrations.

---

## 006 — No Roles/Permissions in v1

**Decision**: All authenticated users have the same access level. No roles.

**Rationale**: Single-user portfolio tool. Multi-tenancy is enforced by ownership checks (each service filters by `userId`), not by roles. RBAC can be added in v2 if needed.

---

## 007 — `techStack` as Free Text String

**Decision**: `Project.techStack` is a `VARCHAR(255)` comma-separated string (e.g. `"Java, Spring, MySQL"`).

**Rationale**: Normalising into a `project_tech_stacks` join table adds complexity with negligible v1 benefit. A simple string is searchable, displayable, and sufficient for portfolio display.

---

## 008 — CORS: localhost:3000 and localhost:5173 Allowed

**Decision**: Allow CORS from both React CRA (port 3000) and Vite (port 5173) dev servers.

**Rationale**: Both are common frontend dev setups. In production, this would be restricted to the deployed domain only.

---

## 009 — Springdoc OpenAPI 3 (not SpringFox)

**Decision**: Use `springdoc-openapi-starter-webmvc-ui` 2.x.

**Rationale**: SpringFox is unmaintained and incompatible with Spring Boot 3. Springdoc is the maintained, Spring Boot 3-compatible alternative with first-class support.
