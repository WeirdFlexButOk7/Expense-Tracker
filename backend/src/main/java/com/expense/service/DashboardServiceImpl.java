package com.expense.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.expense.dto.DashboardExpenseCategoryStat;
import com.expense.dto.DashboardResponse;
import com.expense.entity.User;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.repository.TransactionRepository;
import com.expense.repository.UserRepository;
import com.expense.util.DateRange;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public DashboardResponse getDashboardData(Long userId, DateRange range) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LocalDateTime start = range.from().atStartOfDay();
        LocalDateTime end = range.to().atTime(23, 59, 59);

        BigDecimal salaryIncomeTotal = transactionRepository.sumAmountByCategory(userId, start, end, CategoryTypeEnum.INCOME, CategoryNameEnum.SALARY);
        BigDecimal otherIncomeTotal = transactionRepository.sumAmountByCategory(userId, start, end, CategoryTypeEnum.INCOME, CategoryNameEnum.OTHER_INCOME);
        BigDecimal incomeTotal = salaryIncomeTotal.add(otherIncomeTotal);
        BigDecimal expenseTotal = transactionRepository.sumAmountByCategory(userId, start, end, CategoryTypeEnum.EXPENSE, null);

        long incomeTransactionsCount = transactionRepository.countTransactionsByCategory(userId, start, end, CategoryTypeEnum.INCOME, null);
        long expenseTransactionsCount = transactionRepository.countTransactionsByCategory(userId, start, end, CategoryTypeEnum.EXPENSE, null);
        long transactionCount = incomeTransactionsCount + expenseTransactionsCount;

        List<DashboardExpenseCategoryStat> expenseBreakdown = new ArrayList<>();
        List<Object[]> breakdown = transactionRepository.expenseBreakdown(userId, start, end);

        for (Object[] row : breakdown) {
            CategoryNameEnum category = (CategoryNameEnum) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = (long) row[2];
            expenseBreakdown.add(new DashboardExpenseCategoryStat(category, amount, count));
        }

        return DashboardResponse.builder()
            .username(user.getUsername())
            .balance(user.getBalance())
            .fromDate(range.from())
            .toDate(range.to())
            .totalIncome(incomeTotal)
            .totalExpense(expenseTotal)
            .transactionsCount(transactionCount)
            .incomeTransactionsCount(incomeTransactionsCount)
            .expenseTransactionsCount(expenseTransactionsCount)
            .totalSalaryIncome(salaryIncomeTotal)
            .totalOtherIncome(otherIncomeTotal)
            .expenseBreakdown(expenseBreakdown)
            .build();
    }
}
