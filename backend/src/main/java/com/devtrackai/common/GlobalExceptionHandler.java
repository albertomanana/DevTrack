package com.devtrackai.common;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        // ── 400 Bad Request ──────────────────────────────────────────────────────

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(
                        MethodArgumentNotValidException ex, HttpServletRequest req) {

                Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                                .collect(Collectors.toMap(
                                                FieldError::getField,
                                                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage()
                                                                : "Invalid value",
                                                (existing, replacement) -> existing));

                return ResponseEntity.badRequest().body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(400)
                                .error("Validation Failed")
                                .message("One or more fields are invalid")
                                .path(req.getRequestURI())
                                .validationErrors(fieldErrors)
                                .build());
        }

        // ── 401 Unauthorized ─────────────────────────────────────────────────────

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponse> handleBadCredentials(
                        BadCredentialsException ex, HttpServletRequest req) {

                log.warn("Authentication failure on {}: {}", req.getRequestURI(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(401)
                                .error("Unauthorized")
                                .message("Invalid email or password")
                                .path(req.getRequestURI())
                                .build());
        }

        // ── 404 Not Found ────────────────────────────────────────────────────────

        @ExceptionHandler(UsernameNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(
                        UsernameNotFoundException ex, HttpServletRequest req) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(404)
                                .error("Not Found")
                                .message(ex.getMessage())
                                .path(req.getRequestURI())
                                .build());
        }

        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleEntityNotFound(
                        EntityNotFoundException ex, HttpServletRequest req) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(404)
                                .error("Not Found")
                                .message(ex.getMessage())
                                .path(req.getRequestURI())
                                .build());
        }

        // ── 409 Conflict ─────────────────────────────────────────────────────────

        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<ErrorResponse> handleConflict(
                        IllegalStateException ex, HttpServletRequest req) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(409)
                                .error("Conflict")
                                .message(ex.getMessage())
                                .path(req.getRequestURI())
                                .build());
        }

        // ── 500 Internal Server Error ────────────────────────────────────────────

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneric(
                        Exception ex, HttpServletRequest req) {

                log.error("Unhandled exception on {}", req.getRequestURI(), ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(500)
                                .error("Internal Server Error")
                                .message("An unexpected error occurred")
                                .path(req.getRequestURI())
                                .build());
        }
}
