import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { projectsApi, tasksApi } from '../api'
import { useI18n } from '../context/I18nContext'
import { getApiErrorMessage } from '../utils/apiError'

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH']
const statusOptions = ['TODO', 'DOING', 'DONE']

const emptyTaskForm = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
}

function formatDate(value, locale) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString(locale)
}

export default function ProjectDetailPage() {
    const { t, locale } = useI18n()
    const { id } = useParams()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [taskForm, setTaskForm] = useState(emptyTaskForm)
    const [submitting, setSubmitting] = useState(false)
    const projectStatusLabel = (status) => (status ? t(`enums.projectStatus.${status}`) : '-')
    const taskStatusLabel = (status) => (status ? t(`enums.taskStatus.${status}`) : '-')
    const taskPriorityLabel = (priority) => (priority ? t(`enums.taskPriority.${priority}`) : '-')

    const loadData = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setError('')
        try {
            const [projectResponse, tasksResponse] = await Promise.all([
                projectsApi.getById(id),
                tasksApi.getByProject(id),
            ])
            setProject(projectResponse.data)
            setTasks(tasksResponse.data || [])
        } catch (apiError) {
            setError(getApiErrorMessage(apiError, t('common.couldNotLoadProjectDetails')))
        } finally {
            setLoading(false)
        }
    }, [id, t])

    useEffect(() => {
        loadData()
    }, [loadData])

    function openCreateModal() {
        setEditingTaskId(null)
        setTaskForm(emptyTaskForm)
        setModalOpen(true)
    }

    function openEditModal(task) {
        setEditingTaskId(task.id)
        setTaskForm({
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'MEDIUM',
            status: task.status || 'TODO',
            dueDate: task.dueDate || '',
        })
        setModalOpen(true)
    }

    async function handleTaskSubmit(event) {
        event.preventDefault()
        if (!id) return
        setSubmitting(true)
        try {
            const payload = {
                ...taskForm,
                dueDate: taskForm.dueDate || null,
            }
            if (editingTaskId) {
                await tasksApi.update(editingTaskId, payload)
                toast.success(t('common.taskUpdated'))
            } else {
                await tasksApi.create(id, payload)
                toast.success(t('common.taskCreated'))
            }
            setModalOpen(false)
            await loadData()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotSaveTask')))
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDeleteTask(taskId) {
        if (!window.confirm(t('common.removeTaskConfirm'))) return
        try {
            await tasksApi.remove(taskId)
            toast.success(t('common.taskDeleted'))
            await loadData()
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotDeleteTask')))
        }
    }

    async function handleStatusChange(taskId, status) {
        try {
            await tasksApi.updateStatus(taskId, status)
            setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
        } catch (apiError) {
            toast.error(getApiErrorMessage(apiError, t('common.couldNotUpdateTaskStatus')))
        }
    }

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-8 text-slate-200">
                <div className="card">{t('common.loadingProject')}</div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-8 text-slate-200">
                <div className="card border-red-500/40 text-red-300">{error}</div>
                <Link to="/projects" className="btn-secondary mt-4 inline-block text-sm">{t('common.backToProjects')}</Link>
            </section>
        )
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-100">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <Link to="/projects" className="text-sm text-brand-400 hover:text-brand-100">&larr; {t('common.backToProjects')}</Link>
                    <h1 className="mt-1 text-3xl font-black">{project?.title}</h1>
                    <p className="text-slate-400 mt-1">{t('common.updated')} {formatDate(project?.updatedAt, locale)}</p>
                </div>
                <button className="btn-primary text-sm" onClick={openCreateModal}>{t('common.newTask')}</button>
            </div>

            <article className="card">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                    <span className={`badge-${String(project?.status || 'idea').toLowerCase()}`}>{projectStatusLabel(project?.status)}</span>
                    {project?.techStack && <span className="badge bg-slate-700 text-slate-300">{project.techStack}</span>}
                    {project?.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-brand-400 hover:text-brand-100"
                        >
                            {t('common.github')}
                        </a>
                    )}
                </div>
                <p className="text-slate-300 whitespace-pre-line">{project?.description || t('common.noDescription')}</p>
            </article>

            <div className="card">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{t('common.tasks')}</h2>
                    <span className="text-sm text-slate-400">{tasks.length} {t('common.total')}</span>
                </div>

                {tasks.length === 0 ? (
                    <p className="mt-4 text-slate-400">{t('common.noTasksYet')}</p>
                ) : (
                    <div className="mt-4 space-y-3">
                        {tasks.map((task) => (
                            <article key={task.id} className="bg-slate-900/50 border border-surface-border rounded-xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">{task.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1 whitespace-pre-line">{task.description || t('common.noDescription')}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`badge-${String(task.priority || 'medium').toLowerCase()}`}>{taskPriorityLabel(task.priority)}</span>
                                        <span className={`badge-${String(task.status || 'todo').toLowerCase()}`}>{taskStatusLabel(task.status)}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                                    <p className="text-xs text-slate-500">{t('common.due')}: {task.dueDate || '-'}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            className="input text-sm py-1.5 px-3 w-36"
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>{taskStatusLabel(status)}</option>
                                            ))}
                                        </select>
                                        <button className="btn-secondary text-sm px-3 py-1.5" onClick={() => openEditModal(task)}>
                                            {t('common.edit')}
                                        </button>
                                        <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}>
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">{editingTaskId ? t('common.editTask') : t('common.newTask')}</h2>
                        <form onSubmit={handleTaskSubmit} className="space-y-4">
                            <div>
                                <label className="label" htmlFor="task-title">{t('common.title')}</label>
                                <input
                                    id="task-title"
                                    className="input"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                                    required
                                    maxLength={150}
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="task-description">{t('common.description')}</label>
                                <textarea
                                    id="task-description"
                                    className="input min-h-24"
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                                    maxLength={5000}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="label" htmlFor="task-priority">{t('common.priority')}</label>
                                    <select
                                        id="task-priority"
                                        className="input"
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
                                        disabled={submitting}
                                    >
                                        {priorityOptions.map((priority) => (
                                            <option key={priority} value={priority}>{taskPriorityLabel(priority)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label" htmlFor="task-status">{t('common.status')}</label>
                                    <select
                                        id="task-status"
                                        className="input"
                                        value={taskForm.status}
                                        onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}
                                        disabled={submitting}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>{taskStatusLabel(status)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label" htmlFor="task-duedate">{t('common.due')}</label>
                                    <input
                                        id="task-duedate"
                                        type="date"
                                        className="input"
                                        value={taskForm.dueDate || ''}
                                        onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                        disabled={submitting}
                                    />
                                </div>
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
