package com.expense.dto;

import java.math.BigDecimal;

import com.expense.enums.CategoryNameEnum;

public record DashboardExpenseCategoryStat(
    CategoryNameEnum category,
    BigDecimal totalAmount,
    long transactionCount
) {}
