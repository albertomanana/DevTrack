package com.devtrackai.studysessions;

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

@RestController
@RequestMapping("/api/study-sessions")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Study Sessions", description = "Log and manage study sessions")
public class StudySessionController {

    private final StudySessionService sessionService;

    @GetMapping
    @Operation(summary = "List all study sessions for the authenticated user")
    public ResponseEntity<List<StudySessionResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(sessionService.getAll(userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Log a new study session")
    public ResponseEntity<StudySessionResponse> create(
            @Valid @RequestBody StudySessionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.create(request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a study session")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        sessionService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
