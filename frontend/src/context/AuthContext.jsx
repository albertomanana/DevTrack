import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('devtrack_user')
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    })

    const login = useCallback((authResponse) => {
        const { token, ...userInfo } = authResponse
        localStorage.setItem('devtrack_token', token)
        localStorage.setItem('devtrack_user', JSON.stringify(userInfo))
        setUser(userInfo)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('devtrack_token')
        localStorage.removeItem('devtrack_user')
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
