package com.devtrackai.projects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 150, message = "Title must be between 1 and 150 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Size(max = 255, message = "Tech stack must not exceed 255 characters")
    private String techStack;

    private ProjectStatus status;

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    private String githubUrl;
}
