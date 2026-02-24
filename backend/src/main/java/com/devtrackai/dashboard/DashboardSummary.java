package com.devtrackai.dashboard;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardSummary {

    // Projects
    private long totalProjects;
    private Map<String, Long> projectsByStatus;

    // Tasks
    private long totalTasks;
    private Map<String, Long> tasksByStatus;

    // Study minutes
    private int studyMinutesThisWeek;

    /**
     * Minutes studied per week for the last 6 weeks.
     * Index 0 = current week, index 5 = 5 weeks ago.
     */
    private List<Integer> studyMinutesByWeek;

    // Streak
    private int streakDays;
}
