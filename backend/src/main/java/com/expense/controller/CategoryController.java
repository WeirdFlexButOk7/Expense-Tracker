package com.expense.controller;

import com.expense.entity.Category;
import com.expense.service.CategoryService;
import com.expense.config.UserDetailsImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getUser(Authentication authentication) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        
        List<Category> resp = categoryService.getAllCategories(userId);
        return ResponseEntity.ok(resp);
    }
}
