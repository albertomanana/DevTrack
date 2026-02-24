package com.devtrackai.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type;
    private String refreshToken;
    private Long userId;
    private String username;
    private String email;

    public static AuthResponse of(String token, String refreshToken, Long userId, String username, String email) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .refreshToken(refreshToken)
                .userId(userId)
                .username(username)
                .email(email)
                .build();
    }
}
