package com.expense.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter authFilter;
    private final JwtAuthEntryPoint authEntryPoint;

    public SecurityConfig(JwtAuthFilter authFilter, JwtAuthEntryPoint authEntryPoint) {
        this.authFilter = authFilter;
        this.authEntryPoint = authEntryPoint;
    }

    // No auth required.
    @Bean
    @Order(1)
    public SecurityFilterChain authEndpointsSecurityChain(HttpSecurity http) throws Exception {
        return http.securityMatcher("/api/auth/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .build();
    }

    // Chain for protected endpoints. JWT auth required.
    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurityChain(HttpSecurity http) throws Exception {
        return http.securityMatcher("/api/**")
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
