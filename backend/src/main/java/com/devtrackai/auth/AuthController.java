package com.devtrackai.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Register and login endpoints — no token required")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  @Operation(summary = "Register a new user", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
      {
        "username": "alberto",
        "email": "alberto@example.com",
        "password": "Secur3Pass!"
      }
      """))), responses = {
      @ApiResponse(responseCode = "200", description = "User registered — JWT returned", content = @Content(schema = @Schema(implementation = AuthResponse.class), examples = @ExampleObject(value = """
          {
            "token": "eyJhbGciOiJIUzI1NiJ9...",
            "type": "Bearer",
            "userId": 1,
            "username": "alberto",
            "email": "alberto@example.com"
          }
          """))),
      @ApiResponse(responseCode = "400", description = "Validation error"),
      @ApiResponse(responseCode = "409", description = "Email or username already taken")
  })
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/login")
  @Operation(summary = "Login with email + password", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
      {
        "email": "alberto@example.com",
        "password": "Secur3Pass!"
      }
      """))), responses = {
      @ApiResponse(responseCode = "200", description = "Login successful — JWT returned", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Validation error"),
      @ApiResponse(responseCode = "401", description = "Invalid credentials")
  })
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Refresh access token", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
      {
        "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
      }
      """))), responses = {
      @ApiResponse(responseCode = "200", description = "Token refreshed successfully", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Validation error"),
      @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
  })
  public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
    return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }
}
