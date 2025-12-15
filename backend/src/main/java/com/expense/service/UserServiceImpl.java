package com.expense.service;

import com.expense.dto.UserResponse;
import com.expense.entity.User;
import com.expense.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return UserResponse.builder()
            .id(id)
            .username(user.getUsername())
            .balance(user.getBalance())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
