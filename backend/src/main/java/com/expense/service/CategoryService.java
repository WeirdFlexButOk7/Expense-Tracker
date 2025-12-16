package com.expense.service;

import com.expense.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories(Long id);
}
