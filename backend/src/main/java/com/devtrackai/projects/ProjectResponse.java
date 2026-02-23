package com.devtrackai.projects;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private String techStack;
    private ProjectStatus status;
    private String githubUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponse from(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .techStack(p.getTechStack())
                .status(p.getStatus())
                .githubUrl(p.getGithubUrl())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
