package com.devtrackai.projects;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Project> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    // ── Dashboard queries ─────────────────────────────────────────────────────

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ProjectStatus status);
}
