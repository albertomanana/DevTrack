import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LanguageToggle from '../components/LanguageToggle'
import { getApiErrorMessage } from '../utils/apiError'

const LOGIN_MODE = 'login'
const REGISTER_MODE = 'register'

const loginInitialState = {
    email: '',
    password: '',
}

const registerInitialState = {
    username: '',
    email: '',
    password: '',
}

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { t } = useI18n()
    const [mode, setMode] = useState(LOGIN_MODE)
    const [loginForm, setLoginForm] = useState(loginInitialState)
    const [registerForm, setRegisterForm] = useState(registerInitialState)
    const [submitting, setSubmitting] = useState(false)

    const isRegister = useMemo(() => mode === REGISTER_MODE, [mode])

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)
        try {
            if (isRegister) {
                const response = await authApi.register(registerForm)
                login(response.data)
                toast.success(t('common.accountCreated'))
            } else {
                const response = await authApi.login(loginForm)
                login(response.data)
                toast.success(t('common.welcomeBack'))
            }
            navigate('/dashboard', { replace: true })
        } catch (error) {
            toast.error(getApiErrorMessage(error, t('common.authFailed')))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-surface via-slate-900 to-surface text-slate-100 flex items-center justify-center p-4">
            <div className="fixed top-4 right-4 z-50">
                <LanguageToggle />
            </div>
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
                <div className="card flex flex-col justify-between bg-surface-card/80 backdrop-blur">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-brand-400">DevTrack AI</p>
                        <h1 className="mt-4 text-3xl font-black leading-tight">
                            {t('common.loginHeroTitle')}
                        </h1>
                        <p className="mt-4 text-slate-400">
                            {t('common.signInToContinue')}
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-surface-border">{t('common.projects')}</div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-surface-border">{t('common.tasks')}</div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-surface-border">{t('common.sessions')}</div>
                    </div>
                </div>

                <div className="card bg-surface-card/95">
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setMode(LOGIN_MODE)}
                            className={mode === LOGIN_MODE ? 'btn-primary flex-1' : 'btn-secondary flex-1'}
                            disabled={submitting}
                        >
                            {t('common.login')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode(REGISTER_MODE)}
                            className={mode === REGISTER_MODE ? 'btn-primary flex-1' : 'btn-secondary flex-1'}
                            disabled={submitting}
                        >
                            {t('common.register')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div>
                                <label className="label" htmlFor="username">{t('common.username')}</label>
                                <input
                                    id="username"
                                    className="input"
                                    value={registerForm.username}
                                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                                    placeholder="alberto"
                                    minLength={3}
                                    maxLength={50}
                                    required
                                    disabled={submitting}
                                />
                            </div>
                        )}

                        <div>
                            <label className="label" htmlFor="email">{t('common.email')}</label>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                value={isRegister ? registerForm.email : loginForm.email}
                                onChange={(e) => {
                                    const { value } = e.target
                                    if (isRegister) {
                                        setRegisterForm((prev) => ({ ...prev, email: value }))
                                    } else {
                                        setLoginForm((prev) => ({ ...prev, email: value }))
                                    }
                                }}
                                placeholder="alberto@example.com"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="password">{t('common.password')}</label>
                            <input
                                id="password"
                                type="password"
                                className="input"
                                value={isRegister ? registerForm.password : loginForm.password}
                                onChange={(e) => {
                                    const { value } = e.target
                                    if (isRegister) {
                                        setRegisterForm((prev) => ({ ...prev, password: value }))
                                    } else {
                                        setLoginForm((prev) => ({ ...prev, password: value }))
                                    }
                                }}
                                placeholder="********"
                                minLength={8}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full py-2.5" disabled={submitting}>
                            {submitting ? t('common.pleaseWait') : isRegister ? t('common.createAccount') : t('common.signIn')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
