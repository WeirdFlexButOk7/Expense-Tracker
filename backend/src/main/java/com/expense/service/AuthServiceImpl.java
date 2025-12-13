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

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public RegisterResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        User user = new User()
            .setUsername(req.getUsername())
            .setPassword(passwordEncoder.encode(req.getPassword()))
            .setBalance(req.getBalance())
            .setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return new RegisterResponse(savedUser.getId(), savedUser.getUsername());
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        String token = jwtUtil.generateToken(request.getUsername());
        return new LoginResponse(token);
    }
}
