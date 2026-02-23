package com.devtrackai.tasks;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "Manage tasks within a project")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/api/projects/{projectId}/tasks")
    @Operation(summary = "List all tasks for a project")
    public ResponseEntity<List<TaskResponse>> getByProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getByProject(projectId, userDetails.getUsername()));
    }

    @PostMapping("/api/projects/{projectId}/tasks")
    @Operation(summary = "Create a task in a project")
    public ResponseEntity<TaskResponse> create(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(projectId, request, userDetails.getUsername()));
    }

    @PutMapping("/api/tasks/{taskId}")
    @Operation(summary = "Update a task")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.update(taskId, request, userDetails.getUsername()));
    }

    @PatchMapping("/api/tasks/{taskId}/status")
    @Operation(summary = "Update only the status of a task (TODO / DOING / DONE)")
    public ResponseEntity<TaskResponse> patchStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskStatus newStatus = TaskStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(taskService.patchStatus(taskId, newStatus, userDetails.getUsername()));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> delete(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.delete(taskId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
