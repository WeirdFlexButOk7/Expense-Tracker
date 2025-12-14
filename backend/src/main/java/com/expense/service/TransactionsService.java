package com.expense.service;

import java.math.BigDecimal;

import com.expense.dto.TransactionsResponse;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.util.DateRange;

public interface TransactionsService {
    TransactionsResponse getTransactions(
        Long userId,
        DateRange fromToDateRange,
        CategoryTypeEnum categoryType,
        CategoryNameEnum categoryName,
        String name,
        String paymentMode,
        String note,
        BigDecimal minAmount,
        BigDecimal maxAmount
    );
}
