package com.expense;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

import com.expense.entity.User;
import com.expense.repository.UserRepository;

@SpringBootApplication
public class ExpenseApplication {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ExpenseApplication.class, args);
    }

    @Bean
    public CommandLineRunner demo(UserRepository userRepository) {  
        return (args) -> {
            
        };
    }
}
