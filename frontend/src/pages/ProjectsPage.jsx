import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { projectsApi } from '../api'
import { useI18n } from '../context/I18nContext'
import { getApiErrorMessage } from '../utils/apiError'

const statuses = ['IDEA', 'ACTIVE', 'DONE']

const emptyProjectForm = {
    title: '',
    description: '',
    techStack: '',
    status: 'IDEA',
    githubUrl: '',
}

function formatDate(value, locale) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString(locale)
}

export default function ProjectsPage() {
    const { t, locale } = useI18n()
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editingProjectId, setEditingProjectId] = useState(null)
    const [form, setForm] = useState(emptyProjectForm)
    const projectStatusLabel = (status) => (status ? t(`enums.projectStatus.${status}`) : '-')

    const loadProjects = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const response = await projectsApi.getAll()
            setProjects(response.data || [])
        } catch (apiError) {
            setError(getApiErrorMessage(apiError, t('common.couldNotLoadProjects')))
        } finally {
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        loadProjects()
    }, [loadProjects])

    function openCreateModal() {
        setEditingProjectId(null)
        setForm(emptyProjectForm)
        setModalOpen(true)
    }

    function openEditModal(project) {
        setEditingProjectId(project.id)
        setForm({
            title: project.title || '',
            description: project.description || '',
            techStack: project.techStack || '',
            status: project.status || 'IDEA',
            githubUrl: project.githubUrl || '',
        })
        setModalOpen(true)
    }

    async function handleDelete(projectId) {
        if (!window.confirm(t('common.removeProjectConfirm'))) return
        try {
            await projectsApi.remove(projectId)
            toast.success(t('common.projectDeleted'))
            await loadProjects()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotDeleteProject')))
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)
        try {
            if (editingProjectId) {
                await projectsApi.update(editingProjectId, form)
                toast.success(t('common.projectUpdated'))
            } else {
                await projectsApi.create(form)
                toast.success(t('common.projectCreated'))
            }
            setModalOpen(false)
            await loadProjects()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotSaveProject')))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-100">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black">{t('common.projects')}</h1>
                    <p className="text-slate-400 mt-1">{t('common.projectsRoadmap')}</p>
                </div>
                <button className="btn-primary text-sm" onClick={openCreateModal}>
                    {t('common.newProject')}
                </button>
            </div>

            {error && <div className="card border-red-500/40 text-red-300">{error}</div>}

            {loading ? (
                <div className="card">{t('common.loadingProjects')}</div>
            ) : projects.length === 0 ? (
                <div className="card">
                    <p>{t('common.noProjectsYet')}</p>
                    <button className="btn-primary mt-4 text-sm" onClick={openCreateModal}>{t('common.createFirstProject')}</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <article key={project.id} className="card">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-bold">{project.title}</h2>
                                    <p className="text-xs text-slate-500 mt-1">{t('common.updated')} {formatDate(project.updatedAt, locale)}</p>
                                </div>
                                <span className={`badge-${String(project.status || 'idea').toLowerCase()}`}>
                                    {projectStatusLabel(project.status)}
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-slate-300 whitespace-pre-line min-h-12">
                                {project.description || t('common.noDescription')}
                            </p>

                            <div className="mt-4 text-sm text-slate-400">
                                <p><span className="text-slate-500">{t('common.techStack')}:</span> {project.techStack || '-'}</p>
                                <p><span className="text-slate-500">{t('common.github')}:</span> {project.githubUrl || '-'}</p>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <button
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="btn-primary text-sm px-3 py-1.5"
                                >
                                    {t('common.open')}
                                </button>
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="btn-secondary text-sm px-3 py-1.5"
                                >
                                    {t('common.edit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="btn-danger"
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProjectId ? t('common.editProject') : t('common.newProject')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label" htmlFor="project-title">{t('common.title')}</label>
                                <input
                                    id="project-title"
                                    className="input"
                                    value={form.title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                    maxLength={150}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="project-description">{t('common.description')}</label>
                                <textarea
                                    id="project-description"
                                    className="input min-h-24"
                                    value={form.description}
                                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                    maxLength={5000}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label" htmlFor="project-techstack">{t('common.techStack')}</label>
                                    <input
                                        id="project-techstack"
                                        className="input"
                                        value={form.techStack}
                                        onChange={(e) => setForm((prev) => ({ ...prev, techStack: e.target.value }))}
                                        maxLength={255}
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="project-status">{t('common.status')}</label>
                                    <select
                                        id="project-status"
                                        className="input"
                                        value={form.status}
                                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                                        disabled={submitting}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{projectStatusLabel(status)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label" htmlFor="project-github">{t('common.githubUrl')}</label>
                                <input
                                    id="project-github"
                                    className="input"
                                    value={form.githubUrl}
                                    onChange={(e) => setForm((prev) => ({ ...prev, githubUrl: e.target.value }))}
                                    maxLength={255}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    className="btn-secondary text-sm"
                                    onClick={() => setModalOpen(false)}
                                    disabled={submitting}
                                >
                                    {t('common.cancel')}
                                </button>
                                <button className="btn-primary text-sm" type="submit" disabled={submitting}>
                                    {submitting ? t('common.saving') : t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
