package com.devtrackai.auth;

import com.devtrackai.users.User;
import com.devtrackai.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService unit tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("alberto");
        registerRequest.setEmail("alberto@example.com");
        registerRequest.setPassword("Secur3Pass!");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("alberto@example.com");
        loginRequest.setPassword("Secur3Pass!");

        savedUser = User.builder()
                .id(1L)
                .username("alberto")
                .email("alberto@example.com")
                .passwordHash("$2a$hashed")
                .build();
    }

    // ── register ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register: success returns AuthResponse with token")
    void register_success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any())).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getType()).isEqualTo("Bearer");
        assertThat(response.getEmail()).isEqualTo("alberto@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: duplicate email throws IllegalStateException (409)")
    void register_duplicateEmail_throwsConflict() {
        when(userRepository.existsByEmail("alberto@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register: duplicate username throws IllegalStateException (409)")
    void register_duplicateUsername_throwsConflict() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername("alberto")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already taken");

        verify(userRepository, never()).save(any());
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login: success returns AuthResponse with token")
    void login_success() {
        when(userRepository.findByEmail("alberto@example.com")).thenReturn(Optional.of(savedUser));
        when(passwordEncoder.matches("Secur3Pass!", "$2a$hashed")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("login: wrong password throws BadCredentialsException (401)")
    void login_wrongPassword_throwsUnauthorized() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(savedUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("login: unknown email throws BadCredentialsException (401)")
    void login_unknownEmail_throwsUnauthorized() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);
    }
}
