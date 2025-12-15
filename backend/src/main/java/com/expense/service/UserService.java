package com.expense.service;

import com.expense.dto.UserResponse;

public interface UserService {
    UserResponse getUserById(Long id);
}
