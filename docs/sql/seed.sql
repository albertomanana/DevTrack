-- DevTrack AI — Demo Seed Data
-- Run AFTER schema.sql (or after the app has started once with ddl-auto=update).
-- Passwords are BCrypt hashes of "Secur3Pass!"

USE devtrack_ai;

-- ── Demo user ─────────────────────────────────────────────────────────────────
INSERT INTO
    users (
        username,
        email,
        password_hash,
        created_at
    )
VALUES (
        'dev_alberto',
        'alberto@example.com',
        '$2a$10$7QkN.yF3DfFTQ5eXzKnR3O.BBzgI7D8KP.pQ6WqWHBvXMtFDcY3Je',
        NOW()
    )
ON DUPLICATE KEY UPDATE
    username = username;

-- ── Demo projects ─────────────────────────────────────────────────────────────
INSERT INTO
    projects (
        user_id,
        title,
        description,
        tech_stack,
        status,
        github_url,
        created_at,
        updated_at
    )
SELECT u.id, 'DevTrack AI', 'Fullstack portfolio tracker with study sessions, projects and task management.', 'Java, Spring Boot, MySQL, React, Vite', 'ACTIVE', 'https://github.com/albertomanana/devtrack', NOW(), NOW()
FROM users u
WHERE
    u.email = 'alberto@example.com'
ON DUPLICATE KEY UPDATE
    title = title;

INSERT INTO
    projects (
        user_id,
        title,
        description,
        tech_stack,
        status,
        github_url,
        created_at,
        updated_at
    )
SELECT u.id, 'RivasCars Landing', 'Car import landing page built with HTML, CSS, JS.', 'HTML, CSS, JavaScript', 'DONE', 'https://github.com/albertomanana/rivascars', NOW(), NOW()
FROM users u
WHERE
    u.email = 'alberto@example.com'
ON DUPLICATE KEY UPDATE
    title = title;

-- ── Demo tasks ────────────────────────────────────────────────────────────────
INSERT INTO
    tasks (
        project_id,
        title,
        description,
        priority,
        status,
        due_date
    )
SELECT p.id, 'Implement Auth (JWT)', 'Register/Login endpoints with JWT', 'HIGH', 'DONE', NULL
FROM projects p
WHERE
    p.title = 'DevTrack AI'
LIMIT 1;

INSERT INTO
    tasks (
        project_id,
        title,
        description,
        priority,
        status,
        due_date
    )
SELECT p.id, 'Build Projects API', 'CRUD for projects', 'HIGH', 'TODO', '2026-03-01'
FROM projects p
WHERE
    p.title = 'DevTrack AI'
LIMIT 1;

INSERT INTO
    tasks (
        project_id,
        title,
        description,
        priority,
        status,
        due_date
    )
SELECT p.id, 'Design dashboard UI', 'React components for dashboard', 'MEDIUM', 'DOING', '2026-03-15'
FROM projects p
WHERE
    p.title = 'DevTrack AI'
LIMIT 1;

-- ── Demo study sessions ───────────────────────────────────────────────────────
INSERT INTO
    study_sessions (
        user_id,
        project_id,
        session_date,
        minutes,
        notes
    )
SELECT u.id, p.id, CURDATE() - INTERVAL 1 DAY, 90, 'Implemented JWT auth filter'
FROM users u, projects p
WHERE
    u.email = 'alberto@example.com'
    AND p.title = 'DevTrack AI'
LIMIT 1;

INSERT INTO
    study_sessions (
        user_id,
        project_id,
        session_date,
        minutes,
        notes
    )
SELECT u.id, NULL, CURDATE(), 45, 'Studied Spring Security docs'
FROM users u
WHERE
    u.email = 'alberto@example.com'
LIMIT 1;