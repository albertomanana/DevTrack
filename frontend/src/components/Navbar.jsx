import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { t } = useI18n()
    const navigate = useNavigate()
    const navLinks = [
        { to: '/dashboard', label: t('common.dashboard') },
        { to: '/projects', label: t('common.projects') },
        { to: '/study-sessions', label: t('common.sessions') },
    ]

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <nav className="fixed top-0 inset-x-0 z-40 bg-surface-card/80 backdrop-blur border-b border-surface-border">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-white">
                    <span className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-xs">DT</span>
                    DevTrack<span className="text-brand-400">AI</span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-brand-600/20 text-brand-400'
                                    : 'text-slate-400 hover:text-white hover:bg-surface-border'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* User + logout */}
                <div className="flex items-center gap-3">
                    <LanguageToggle compact />
                    <span className="text-sm text-slate-400 hidden sm:block">{user?.username}</span>
                    <button onClick={handleLogout} className="btn-secondary text-sm px-3 py-1.5">
                        {t('common.logout')}
                    </button>
                </div>
            </div>
        </nav>
    )
}
