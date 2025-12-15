package com.expense.service;

import com.expense.dto.RecurringTransactionRequest;
import com.expense.entity.RecurringTransaction;

import java.util.List;

public interface RecurringTransactionService {
    List<RecurringTransaction> getRecurringTransactions(Long userId);

    RecurringTransaction createRecurringTransaction(Long userId, RecurringTransactionRequest req);

    RecurringTransaction updateRecurringTransaction(Long userId, Long id, RecurringTransactionRequest req);

    void deleteRecurringTransaction(Long userId, Long id);
}
