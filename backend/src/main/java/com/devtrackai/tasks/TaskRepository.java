package com.devtrackai.tasks;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByProjectIdOrderByCreatedAtDesc(Long projectId);

    Optional<Task> findByIdAndProjectUserId(Long taskId, Long userId);

    // For dashboard stats
    long countByProjectUserIdAndStatus(Long userId, TaskStatus status);

    long countByProjectUserId(Long userId);
}
