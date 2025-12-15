package com.expense.config;

import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.entity.Category;
import com.expense.repository.CategoryRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoryInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        for (CategoryNameEnum name : CategoryNameEnum.values()) {
            CategoryTypeEnum type = determineType(name);

            categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(name);
                    category.setType(type);
                    return categoryRepository.save(category);
                });
        }
    }

    private CategoryTypeEnum determineType(CategoryNameEnum name) {
        return switch (name) {
            case SALARY, OTHER_INCOME -> CategoryTypeEnum.INCOME;
            default -> CategoryTypeEnum.EXPENSE;
        };
    }
}
