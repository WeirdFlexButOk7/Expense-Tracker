package com.expense.dto;

import java.math.BigDecimal;
import java.util.List;

import com.expense.entity.Transaction;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionResponse {
    
    private String username;
    private long transactionsCount;
    
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal totalDelta;

    List<Transaction> transactions;
}
