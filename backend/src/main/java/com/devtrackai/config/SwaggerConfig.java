package com.devtrackai.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT", description = "Paste your JWT token here. Obtain it from POST /api/auth/login.")
public class SwaggerConfig {

    @Bean
    public OpenAPI devTrackOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DevTrack AI API")
                        .description("""
                                REST API for **DevTrack AI** — a developer productivity tracker.

                                ## Authentication
                                1. Register via `POST /api/auth/register`
                                2. Login via `POST /api/auth/login` to receive a JWT
                                3. Click **Authorize** and enter `Bearer <your-token>`
                                """)
                        .version("v0.1.0")
                        .contact(new Contact()
                                .name("Alberto")
                                .url("https://github.com/albertomanana"))
                        .license(new License().name("MIT")));
    }
}
