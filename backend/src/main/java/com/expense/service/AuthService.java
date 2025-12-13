package com.expense.service;

import com.expense.dto.RegisterRequest;
import com.expense.dto.LoginRequest;
import com.expense.dto.RegisterResponse;
import com.expense.dto.LoginResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
