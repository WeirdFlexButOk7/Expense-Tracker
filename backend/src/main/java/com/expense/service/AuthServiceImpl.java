package com.expense.service;

import com.expense.dto.RegisterRequest;
import com.expense.dto.RegisterResponse;
import com.expense.dto.LoginRequest;
import com.expense.dto.LoginResponse;
import com.expense.entity.User;
import com.expense.repository.UserRepository;
import com.expense.util.JwtUtil;
import com.expense.exception.UsernameAlreadyExistsException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public RegisterResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setBalance(req.getBalance());
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return new RegisterResponse(savedUser.getId(), savedUser.getUsername());
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername();
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, request.getPassword())
        );

        String token = jwtUtil.generateToken(username);
        return new LoginResponse(token, username);
    }
}
