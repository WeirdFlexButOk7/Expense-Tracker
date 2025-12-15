package com.expense.util;

import com.expense.entity.Category;

import java.math.BigDecimal;

public class BalanceUtil {
    public static BigDecimal calculateBalanceChange(BigDecimal amount, Category category) {
        if (amount == null || category == null || category.getType() == null) {
            throw new IllegalArgumentException("Amount and category must not be null");
        }

        return switch (category.getType()) {
            case INCOME -> amount;
            case EXPENSE -> amount.negate();
        };
    }
}
