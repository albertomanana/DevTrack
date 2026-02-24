package com.devtrackai.dashboard;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Aggregated statistics for the authenticated user")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get personal dashboard summary", responses = @ApiResponse(responseCode = "200", description = "Dashboard data", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
            {
              "totalProjects": 3,
              "projectsByStatus": { "IDEA": 1, "ACTIVE": 2, "DONE": 0 },
              "totalTasks": 12,
              "tasksByStatus": { "TODO": 5, "DOING": 4, "DONE": 3 },
              "studyMinutesThisWeek": 240,
              "studyMinutesByWeek": [240, 180, 90, 0, 210, 120],
              "streakDays": 4
            }
            """))))
    public ResponseEntity<DashboardSummary> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getSummary(userDetails.getUsername()));
    }
}
