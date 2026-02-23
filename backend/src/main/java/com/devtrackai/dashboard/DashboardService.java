package com.devtrackai.dashboard;

import com.devtrackai.projects.ProjectRepository;
import com.devtrackai.projects.ProjectStatus;
import com.devtrackai.studysessions.StudySessionRepository;
import com.devtrackai.tasks.TaskRepository;
import com.devtrackai.tasks.TaskStatus;
import com.devtrackai.users.User;
import com.devtrackai.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final StudySessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public DashboardSummary getSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Long uid = user.getId();

        // ── Projects ─────────────────────────────────────────────────────────
        long totalProjects = projectRepository.countByUserId(uid);
        Map<String, Long> projectsByStatus = Map.of(
                ProjectStatus.IDEA.name(), projectRepository.countByUserIdAndStatus(uid, ProjectStatus.IDEA),
                ProjectStatus.ACTIVE.name(), projectRepository.countByUserIdAndStatus(uid, ProjectStatus.ACTIVE),
                ProjectStatus.DONE.name(), projectRepository.countByUserIdAndStatus(uid, ProjectStatus.DONE));

        // ── Tasks ─────────────────────────────────────────────────────────────
        long totalTasks = taskRepository.countByProjectUserId(uid);
        Map<String, Long> tasksByStatus = Map.of(
                TaskStatus.TODO.name(), taskRepository.countByProjectUserIdAndStatus(uid, TaskStatus.TODO),
                TaskStatus.DOING.name(), taskRepository.countByProjectUserIdAndStatus(uid, TaskStatus.DOING),
                TaskStatus.DONE.name(), taskRepository.countByProjectUserIdAndStatus(uid, TaskStatus.DONE));

        // ── Study minutes this week ───────────────────────────────────────────
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        int studyMinutesThisWeek = sessionRepository.sumMinutesBetween(uid, weekStart, today);

        // ── Minutes by week (last 6 weeks, index 0 = current) ────────────────
        List<Integer> studyMinutesByWeek = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            LocalDate wStart = weekStart.minusWeeks(i);
            LocalDate wEnd = wStart.plusDays(6);
            studyMinutesByWeek.add(sessionRepository.sumMinutesBetween(uid, wStart, wEnd));
        }

        // ── Streak calculation ────────────────────────────────────────────────
        int streak = calculateStreak(sessionRepository.findDistinctSessionDatesByUserIdDesc(uid), today);

        return DashboardSummary.builder()
                .totalProjects(totalProjects)
                .projectsByStatus(projectsByStatus)
                .totalTasks(totalTasks)
                .tasksByStatus(tasksByStatus)
                .studyMinutesThisWeek(studyMinutesThisWeek)
                .studyMinutesByWeek(studyMinutesByWeek)
                .streakDays(streak)
                .build();
    }

    /**
     * Counts consecutive days ending at today (or yesterday).
     * A streak is active if the user studied today or yesterday.
     */
    private int calculateStreak(List<LocalDate> dates, LocalDate today) {
        if (dates.isEmpty())
            return 0;

        LocalDate expected = dates.get(0).isEqual(today) ? today : today.minusDays(1);
        if (!dates.get(0).isEqual(expected))
            return 0; // no session today or yesterday

        int streak = 0;
        for (LocalDate d : dates) {
            if (d.isEqual(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }
}
