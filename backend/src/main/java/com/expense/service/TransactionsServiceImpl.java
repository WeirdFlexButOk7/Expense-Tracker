package com.expense.service;

import com.expense.dto.TransactionsResponse;
import com.expense.entity.Transaction;
import com.expense.entity.User;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.repository.TransactionRepository;
import com.expense.repository.UserRepository;
import com.expense.util.DateRange;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionsServiceImpl implements TransactionsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public TransactionsResponse getTransactions(
        Long userId,
        DateRange dateRange,
        CategoryTypeEnum categoryType,
        CategoryNameEnum categoryName,
        String name,
        String paymentMode,
        String note,
        BigDecimal minAmount,
        BigDecimal maxAmount
    ) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LocalDateTime start = dateRange.from().atStartOfDay();
        LocalDateTime end = dateRange.to().atTime(23, 59, 59);

        List<Transaction> list = transactionRepository.filterTransactions(
            userId,
            start,
            end,
            categoryType,
            categoryName,
            name,
            paymentMode,
            note,
            minAmount,
            maxAmount
        );

        long transactionsCount = list.size();

        BigDecimal incomeTotal = transactionRepository.sumAmountByCategory(userId, start, end, CategoryTypeEnum.INCOME, null);
        BigDecimal expenseTotal = transactionRepository.sumAmountByCategory(userId, start, end, CategoryTypeEnum.EXPENSE, null);
        BigDecimal delta = incomeTotal.subtract(expenseTotal);

        return TransactionsResponse.builder()
            .username(user.getUsername())
            .transactions(list)
            .transactionsCount(transactionsCount)
            .totalIncome(incomeTotal)
            .totalExpense(expenseTotal)
            .totalDelta(delta)
            .build();
    }
}
