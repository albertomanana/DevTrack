import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { projectsApi, sessionsApi } from '../api'
import { useI18n } from '../context/I18nContext'
import { getApiErrorMessage } from '../utils/apiError'

function todayDateInputValue() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${now.getFullYear()}-${month}-${day}`
}

const emptyForm = {
    sessionDate: todayDateInputValue(),
    minutes: 30,
    notes: '',
    projectId: '',
}

function formatDate(value, locale) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString(locale)
}

export default function StudySessionsPage() {
    const { t, locale } = useI18n()
    const [sessions, setSessions] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState(emptyForm)

    const totalMinutes = useMemo(
        () => sessions.reduce((acc, session) => acc + (Number(session.minutes) || 0), 0),
        [sessions],
    )

    const loadData = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const [sessionsResponse, projectsResponse] = await Promise.all([
                sessionsApi.getAll(),
                projectsApi.getAll(),
            ])
            setSessions(sessionsResponse.data || [])
            setProjects(projectsResponse.data || [])
        } catch (apiError) {
            setError(getApiErrorMessage(apiError, t('common.couldNotLoadSessions')))
        } finally {
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        loadData()
    }, [loadData])

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)
        try {
            await sessionsApi.create({
                sessionDate: form.sessionDate,
                minutes: Number(form.minutes),
                notes: form.notes || null,
                projectId: form.projectId ? Number(form.projectId) : null,
            })
            toast.success(t('common.sessionAdded'))
            setForm((prev) => ({
                ...emptyForm,
                sessionDate: prev.sessionDate,
            }))
            await loadData()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotCreateSession')))
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(sessionId) {
        if (!window.confirm(t('common.removeSessionConfirm'))) return
        try {
            await sessionsApi.remove(sessionId)
            toast.success(t('common.sessionDeleted'))
            await loadData()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotDeleteSession')))
        }
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 text-slate-100 space-y-6">
            <div>
                <h1 className="text-3xl font-black">{t('common.sessions')}</h1>
                <p className="text-slate-400 mt-1">{t('common.sessionsOverview')}</p>
            </div>

            {error && <div className="card border-red-500/40 text-red-300">{error}</div>}

            <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-4">
                <article className="card h-fit">
                    <h2 className="text-xl font-bold">{t('common.logSession')}</h2>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="label" htmlFor="session-date">{t('common.date')}</label>
                            <input
                                id="session-date"
                                type="date"
                                className="input"
                                value={form.sessionDate}
                                onChange={(e) => setForm((prev) => ({ ...prev, sessionDate: e.target.value }))}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="session-minutes">{t('common.minutes')}</label>
                            <input
                                id="session-minutes"
                                type="number"
                                min={1}
                                className="input"
                                value={form.minutes}
                                onChange={(e) => setForm((prev) => ({ ...prev, minutes: e.target.value }))}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="session-project">{t('common.projectOptional')}</label>
                            <select
                                id="session-project"
                                className="input"
                                value={form.projectId}
                                onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                                disabled={submitting}
                            >
                                <option value="">{t('common.noProject')}</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label" htmlFor="session-notes">{t('common.notes')}</label>
                            <textarea
                                id="session-notes"
                                className="input min-h-24"
                                value={form.notes}
                                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                                maxLength={5000}
                                disabled={submitting}
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full text-sm" disabled={submitting}>
                            {submitting ? t('common.saving') : t('common.addSession')}
                        </button>
                    </form>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold">{t('common.history')}</h2>
                        <span className="text-sm text-slate-400">
                            {sessions.length} {t('common.sessions').toLowerCase()} | {totalMinutes} {t('common.minutes').toLowerCase()}
                        </span>
                    </div>

                    {loading ? (
                        <p className="mt-4 text-slate-400">{t('common.loadingSessions')}</p>
                    ) : sessions.length === 0 ? (
                        <p className="mt-4 text-slate-400">{t('common.noSessionsYet')}</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {sessions.map((session) => (
                                <article key={session.id} className="bg-slate-900/50 border border-surface-border rounded-xl p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold">
                                                {session.minutes} min {t('common.on')} {formatDate(session.sessionDate, locale)}
                                            </h3>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {t('common.project')}: {session.projectTitle || t('common.generalStudy')}
                                            </p>
                                            <p className="text-sm text-slate-300 mt-2 whitespace-pre-line">
                                                {session.notes || t('common.noNotes')}
                                            </p>
                                        </div>
                                        <button className="btn-danger h-fit" onClick={() => handleDelete(session.id)}>
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    )
}
