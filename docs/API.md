# API Reference — DevTrack AI v1

> **Base URL**: `http://localhost:8080/api`  
> **Auth**: All endpoints except `/auth/*` require `Authorization: Bearer <token>`  
> **Interactive docs**: http://localhost:8080/swagger-ui.html

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register new user, returns JWT |
| `POST` | `/auth/login` | ❌ | Login, returns JWT |

### POST /auth/register
```json
// Request
{ "username": "alberto", "email": "alberto@example.com", "password": "Secur3Pass!" }

// 200 OK
{ "token": "eyJ...", "type": "Bearer", "userId": 1, "username": "alberto", "email": "alberto@example.com" }

// 409 Conflict
{ "timestamp": "...", "status": 409, "error": "Conflict", "message": "Email is already registered: ..." }
```

### POST /auth/login
```json
// Request
{ "email": "alberto@example.com", "password": "Secur3Pass!" }

// 200 OK — same AuthResponse as register
// 401 Unauthorized — wrong credentials
```

---

## Projects *(Sprint 2)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/projects` | ✅ | List all projects of authenticated user |
| `POST` | `/projects` | ✅ | Create new project |
| `GET` | `/projects/{id}` | ✅ | Get project by ID |
| `PUT` | `/projects/{id}` | ✅ | Update project |
| `DELETE` | `/projects/{id}` | ✅ | Delete project (cascades tasks) |

---

## Tasks *(Sprint 2)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/projects/{projectId}/tasks` | ✅ | List tasks in project |
| `POST` | `/projects/{projectId}/tasks` | ✅ | Create task in project |
| `PUT` | `/tasks/{taskId}` | ✅ | Update task |
| `DELETE` | `/tasks/{taskId}` | ✅ | Delete task |
| `PATCH` | `/tasks/{taskId}/status` | ✅ | Update task status only |

---

## Study Sessions *(Sprint 2)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/study-sessions` | ✅ | List user's sessions |
| `POST` | `/study-sessions` | ✅ | Log new session |
| `DELETE` | `/study-sessions/{id}` | ✅ | Delete session |

---

## Dashboard *(Sprint 2)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard/summary` | ✅ | Aggregated stats for current user |

```json
// 200 OK example
{
  "totalProjects": 3,
  "projectsByStatus": { "IDEA": 1, "ACTIVE": 2, "DONE": 0 },
  "totalTasks": 12,
  "tasksByStatus": { "TODO": 5, "DOING": 4, "DONE": 3 },
  "studyMinutesThisWeek": 240,
  "studyMinutesByWeek": [120, 0, 180, 90, 240, 210],
  "streakDays": 4
}
```

---

## Error Format

All errors return a consistent `ErrorResponse`:
```json
{
  "timestamp": "2026-02-20T10:15:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "One or more fields are invalid",
  "path": "/api/auth/register",
  "validationErrors": {
    "email": "Must be a valid email address",
    "password": "Password must be between 8 and 100 characters"
  }
}
```
