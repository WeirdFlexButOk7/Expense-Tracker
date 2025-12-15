package com.expense.controller;

import com.expense.dto.LoginRequest;
import com.expense.dto.RegisterRequest;
import com.expense.dto.RegisterResponse;
import com.expense.dto.LoginResponse;
import com.expense.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
        @Valid @RequestBody RegisterRequest req
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest req
    ) {
        return ResponseEntity
            .ok(authService.login(req));
    }
}
