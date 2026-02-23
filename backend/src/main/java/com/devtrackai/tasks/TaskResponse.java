package com.devtrackai.tasks;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {

    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse from(Task t) {
        return TaskResponse.builder()
                .id(t.getId())
                .projectId(t.getProject().getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .priority(t.getPriority())
                .status(t.getStatus())
                .dueDate(t.getDueDate())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
