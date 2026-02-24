import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'
import { dashboardApi } from '../api'
import { useI18n } from '../context/I18nContext'
import { getApiErrorMessage } from '../utils/apiError'

const emptySummary = {
    totalProjects: 0,
    projectsByStatus: { IDEA: 0, ACTIVE: 0, DONE: 0 },
    totalTasks: 0,
    tasksByStatus: { TODO: 0, DOING: 0, DONE: 0 },
    studyMinutesThisWeek: 0,
    studyMinutesByWeek: [0, 0, 0, 0, 0, 0],
    streakDays: 0,
}

function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

export default function DashboardPage() {
    const { t, locale } = useI18n()
    const [summary, setSummary] = useState(emptySummary)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true
        async function loadSummary() {
            setLoading(true)
            setError('')
            try {
                const response = await dashboardApi.getSummary()
                if (mounted) {
                    setSummary(response.data)
                }
            } catch (apiError) {
                if (mounted) {
                    setError(getApiErrorMessage(apiError, t('common.couldNotLoadDashboard')))
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }
        loadSummary()
        return () => {
            mounted = false
        }
    }, [t])

    const weekData = useMemo(() => {
        const currentWeekStart = getWeekStart(new Date())
        return (summary.studyMinutesByWeek || []).map((minutes, index) => {
            const week = new Date(currentWeekStart)
            week.setDate(week.getDate() - (index * 7))
            const label = week.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
            })
            return { week: label, minutes }
        }).reverse()
    }, [summary.studyMinutesByWeek, locale])

    const projectStatusLabel = (status) => t(`enums.projectStatus.${status}`)
    const taskStatusLabel = (status) => t(`enums.taskStatus.${status}`)

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-8 text-slate-200">
                <div className="card">{t('common.loadingDashboard')}</div>
            </section>
        )
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 text-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black">{t('common.dashboard')}</h1>
                    <p className="text-slate-400 mt-1">{t('common.dashboardOverview')}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/projects" className="btn-secondary text-sm">{t('common.goToProjects')}</Link>
                    <Link to="/study-sessions" className="btn-primary text-sm">{t('common.logSession')}</Link>
                </div>
            </div>

            {error && (
                <div className="card border-red-500/40 text-red-300">
                    {error}
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <article className="card">
                    <p className="text-sm text-slate-400">{t('common.totalProjects')}</p>
                    <p className="mt-2 text-3xl font-black">{summary.totalProjects}</p>
                </article>
                <article className="card">
                    <p className="text-sm text-slate-400">{t('common.totalTasks')}</p>
                    <p className="mt-2 text-3xl font-black">{summary.totalTasks}</p>
                </article>
                <article className="card">
                    <p className="text-sm text-slate-400">{t('common.minutesThisWeek')}</p>
                    <p className="mt-2 text-3xl font-black">{summary.studyMinutesThisWeek}</p>
                </article>
                <article className="card">
                    <p className="text-sm text-slate-400">{t('common.streak')}</p>
                    <p className="mt-2 text-3xl font-black">{summary.streakDays} {t('common.days')}</p>
                </article>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <article className="card">
                    <h2 className="font-bold">{t('common.projectStatus')}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="badge-idea">{projectStatusLabel('IDEA')}: {summary.projectsByStatus?.IDEA ?? 0}</span>
                        <span className="badge-active">{projectStatusLabel('ACTIVE')}: {summary.projectsByStatus?.ACTIVE ?? 0}</span>
                        <span className="badge-done">{projectStatusLabel('DONE')}: {summary.projectsByStatus?.DONE ?? 0}</span>
                    </div>
                </article>

                <article className="card">
                    <h2 className="font-bold">{t('common.taskStatus')}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="badge-todo">{taskStatusLabel('TODO')}: {summary.tasksByStatus?.TODO ?? 0}</span>
                        <span className="badge-doing">{taskStatusLabel('DOING')}: {summary.tasksByStatus?.DOING ?? 0}</span>
                        <span className="badge-done">{taskStatusLabel('DONE')}: {summary.tasksByStatus?.DONE ?? 0}</span>
                    </div>
                </article>

                <article className="card lg:col-span-1">
                    <h2 className="font-bold">{t('common.quickActions')}</h2>
                    <div className="mt-4 grid gap-2">
                        <Link className="btn-secondary text-sm text-center" to="/projects">{t('common.createProject')}</Link>
                        <Link className="btn-secondary text-sm text-center" to="/projects">{t('common.createTask')}</Link>
                        <Link className="btn-secondary text-sm text-center" to="/study-sessions">{t('common.addStudyLog')}</Link>
                    </div>
                </article>
            </div>

            <article className="card">
                <h2 className="font-bold mb-4">{t('common.studyMinutesLast6Weeks')}</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="week" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </article>
        </section>
    )
}
