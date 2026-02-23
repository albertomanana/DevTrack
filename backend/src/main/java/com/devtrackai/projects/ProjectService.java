package com.devtrackai.projects;

import com.devtrackai.users.User;
import com.devtrackai.users.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private Project getOwnedProject(Long projectId, Long userId) {
        return projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Project not found or access denied: " + projectId));
    }

    // ── CRUD ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAll(String email) {
        User user = getUser(email);
        return projectRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long projectId, String email) {
        User user = getUser(email);
        return ProjectResponse.from(getOwnedProject(projectId, user.getId()));
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request, String email) {
        User user = getUser(email);
        Project project = Project.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.IDEA)
                .githubUrl(request.getGithubUrl())
                .build();
        project = projectRepository.save(project);
        log.info("Project created: id={}, user={}", project.getId(), email);
        return ProjectResponse.from(project);
    }

    @Transactional
    public ProjectResponse update(Long projectId, ProjectRequest request, String email) {
        User user = getUser(email);
        Project project = getOwnedProject(projectId, user.getId());

        if (request.getTitle() != null)
            project.setTitle(request.getTitle());
        if (request.getDescription() != null)
            project.setDescription(request.getDescription());
        if (request.getTechStack() != null)
            project.setTechStack(request.getTechStack());
        if (request.getStatus() != null)
            project.setStatus(request.getStatus());
        if (request.getGithubUrl() != null)
            project.setGithubUrl(request.getGithubUrl());

        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long projectId, String email) {
        User user = getUser(email);
        Project project = getOwnedProject(projectId, user.getId());
        projectRepository.delete(project);
        log.info("Project deleted: id={}, user={}", projectId, email);
    }
}
