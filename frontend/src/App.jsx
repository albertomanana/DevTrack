import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { I18nProvider } from './context/I18nContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import StudySessionsPage from './pages/StudySessionsPage'

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
    const { isAuthenticated } = useAuth()
    return (
        <>
            {isAuthenticated && <Navbar />}
            <main className={isAuthenticated ? 'pt-16' : ''}>
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute><DashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                        <ProtectedRoute><ProjectsPage /></ProtectedRoute>
                    } />
                    <Route path="/projects/:id" element={
                        <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>
                    } />
                    <Route path="/study-sessions" element={
                        <ProtectedRoute><StudySessionsPage /></ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </>
    )
}

export default function App() {
    return (
        <I18nProvider>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </I18nProvider>
    )
}
