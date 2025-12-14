package com.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private String username;
    private LocalDate fromDate;
    private LocalDate toDate;

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private long transactionsCount;

    private BigDecimal totalSalaryIncome;
    private BigDecimal totalOtherIncome;
    private long incomeTransactionsCount;
    private long expenseTransactionsCount;

    private List<DashboardExpenseCategoryStat> expenseBreakdown;
}
