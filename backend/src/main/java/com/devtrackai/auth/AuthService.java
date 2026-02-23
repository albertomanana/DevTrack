package com.devtrackai.auth;

import com.devtrackai.users.User;
import com.devtrackai.users.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Register a new user.
     * Throws {@link IllegalStateException} (→ 409) if email or username already
     * exists.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Duplicate checks
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email is already registered: " + request.getEmail());
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalStateException("Username is already taken: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);
        log.info("New user registered: id={}, username={}", user.getId(), user.getDisplayUsername());

        String token = jwtService.generateToken(user);
        return AuthResponse.of(token, user.getId(), user.getDisplayUsername(), user.getEmail());
    }

    /**
     * Authenticate an existing user.
     * Throws {@link BadCredentialsException} (→ 401) if credentials are wrong.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        log.info("User logged in: id={}, username={}", user.getId(), user.getDisplayUsername());
        String token = jwtService.generateToken(user);
        return AuthResponse.of(token, user.getId(), user.getDisplayUsername(), user.getEmail());
    }
}
