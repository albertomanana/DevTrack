import axios from 'axios'

/**
 * Axios instance pointing to the Spring Boot API.
 * The Vite proxy forwards /api → http://localhost:8080/api during dev.
 *
 * JWT is stored in localStorage (see DECISIONS.md #003).
 */
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('devtrack_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ── Response interceptor — handle 401 globally ───────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and it's not a retry or auth endpoint itself
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('devtrack_refresh_token')
            if (refreshToken) {
                try {
                    // Try to get a new token pair
                    const res = await axios.post('/api/auth/refresh', { refreshToken })
                    const { token, refreshToken: newRefresh } = res.data

                    // Save new tokens
                    localStorage.setItem('devtrack_token', token)
                    localStorage.setItem('devtrack_refresh_token', newRefresh)

                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                } catch (refreshError) {
                    // Refresh token is expired/invalid too -> enforce logout
                    console.error("Refresh token invalid", refreshError)
                }
            }

            // Clean up and logout if we arrive here
            localStorage.removeItem('devtrack_token')
            localStorage.removeItem('devtrack_refresh_token')
            localStorage.removeItem('devtrack_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
}

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    remove: (id) => api.delete(`/projects/${id}`),
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasksApi = {
    getByProject: (projectId) => api.get(`/projects/${projectId}/tasks`),
    create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
    update: (taskId, data) => api.put(`/tasks/${taskId}`, data),
    updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
    remove: (taskId) => api.delete(`/tasks/${taskId}`),
}

// ── Study Sessions ────────────────────────────────────────────────────────────
export const sessionsApi = {
    getAll: () => api.get('/study-sessions'),
    create: (data) => api.post('/study-sessions', data),
    remove: (id) => api.delete(`/study-sessions/${id}`),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
    getSummary: () => api.get('/dashboard/summary'),
}
