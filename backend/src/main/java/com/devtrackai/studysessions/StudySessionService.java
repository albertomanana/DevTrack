package com.devtrackai.studysessions;

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
public class StudySessionService {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> getAll(String email) {
        User user = getUser(email);
        return sessionRepository.findAllByUserIdOrderBySessionDateDesc(user.getId())
                .stream().map(StudySessionResponse::from).toList();
    }

    @Transactional
    public StudySessionResponse create(StudySessionRequest request, String email) {
        User user = getUser(email);

        // Resolve optional project — verify ownership if provided
        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findByIdAndUserId(request.getProjectId(), user.getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Project not found or access denied: " + request.getProjectId()));
        }

        StudySession session = StudySession.builder()
                .user(user)
                .project(project)
                .sessionDate(request.getSessionDate())
                .minutes(request.getMinutes())
                .notes(request.getNotes())
                .build();

        session = sessionRepository.save(session);
        log.info("Study session logged: id={}, minutes={}, user={}", session.getId(), session.getMinutes(), email);
        return StudySessionResponse.from(session);
    }

    @Transactional
    public void delete(Long sessionId, String email) {
        User user = getUser(email);
        StudySession session = sessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Study session not found or access denied: " + sessionId));
        sessionRepository.delete(session);
        log.info("Study session deleted: id={}", sessionId);
    }
}
