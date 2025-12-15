package com.expense.service;

import com.expense.dto.TransactionRequest;
import com.expense.dto.TransactionResponse;
import com.expense.entity.Transaction;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.util.DateRange;

import java.math.BigDecimal;

public interface TransactionService {
    TransactionResponse getTransactions(
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

    Transaction createTransaction(Long userId, TransactionRequest req);

    Transaction updateTransaction(Long userId, Long id, TransactionRequest req);

    void deleteTransaction(Long userId, Long id);
}
