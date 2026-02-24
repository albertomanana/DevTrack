package com.devtrackai.studysessions;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StudySessionResponse {

    private Long id;
    private Long projectId;
    private String projectTitle;
    private LocalDate sessionDate;
    private Integer minutes;
    private String notes;
    private LocalDateTime createdAt;

    public static StudySessionResponse from(StudySession s) {
        return StudySessionResponse.builder()
                .id(s.getId())
                .projectId(s.getProject() != null ? s.getProject().getId() : null)
                .projectTitle(s.getProject() != null ? s.getProject().getTitle() : null)
                .sessionDate(s.getSessionDate())
                .minutes(s.getMinutes())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
