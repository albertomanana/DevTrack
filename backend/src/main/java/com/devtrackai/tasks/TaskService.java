package com.devtrackai.tasks;

import com.devtrackai.projects.Project;
import com.devtrackai.projects.ProjectRepository;
import com.devtrackai.users.User;
import com.devtrackai.users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private Project getOwnedProject(Long projectId, Long userId) {
        return projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Project not found or access denied: " + projectId));
    }

    private Task getOwnedTask(Long taskId, Long userId) {
        return taskRepository.findByIdAndProjectUserId(taskId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Task not found or access denied: " + taskId));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TaskResponse> getByProject(Long projectId, String email) {
        User user = getUser(email);
        getOwnedProject(projectId, user.getId()); // access check
        return taskRepository.findAllByProjectIdOrderByCreatedAtDesc(projectId)
                .stream().map(TaskResponse::from).toList();
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public TaskResponse create(Long projectId, TaskRequest request, String email) {
        User user = getUser(email);
        Project project = getOwnedProject(projectId, user.getId());

        Task task = Task.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .build();

        task = taskRepository.save(task);
        log.info("Task created: id={}, project={}", task.getId(), projectId);
        return TaskResponse.from(task);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public TaskResponse update(Long taskId, TaskRequest request, String email) {
        User user = getUser(email);
        Task task = getOwnedTask(taskId, user.getId());

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getPriority() != null)
            task.setPriority(request.getPriority());
        if (request.getStatus() != null)
            task.setStatus(request.getStatus());
        if (request.getDueDate() != null)
            task.setDueDate(request.getDueDate());

        return TaskResponse.from(taskRepository.save(task));
    }

    // ── Patch Status ──────────────────────────────────────────────────────────

    @Transactional
    public TaskResponse patchStatus(Long taskId, TaskStatus newStatus, String email) {
        User user = getUser(email);
        Task task = getOwnedTask(taskId, user.getId());
        task.setStatus(newStatus);
        return TaskResponse.from(taskRepository.save(task));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void delete(Long taskId, String email) {
        User user = getUser(email);
        Task task = getOwnedTask(taskId, user.getId());
        taskRepository.delete(task);
        log.info("Task deleted: id={}", taskId);
    }
}
