package com.expense.controller;

import com.expense.dto.UserResponse;
import com.expense.service.UserService;
import com.expense.config.UserDetailsImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> getUser(Authentication authentication) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        
        UserResponse resp = userService.getUserById(userId);
        return ResponseEntity.ok(resp);
    }
}
