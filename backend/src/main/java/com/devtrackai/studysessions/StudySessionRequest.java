package com.devtrackai.studysessions;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudySessionRequest {

    @NotNull(message = "Session date is required")
    private LocalDate sessionDate;

    @NotNull(message = "Minutes is required")
    @Min(value = 1, message = "Minutes must be greater than 0")
    private Integer minutes;

    private String notes;

    /** Optional — null means not tied to any project. */
    private Long projectId;
}
