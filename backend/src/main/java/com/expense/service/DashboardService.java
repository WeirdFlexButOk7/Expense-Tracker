package com.expense.service;

import com.expense.dto.DashboardResponse;
import com.expense.util.DateRange;

public interface DashboardService {
    DashboardResponse getDashboardData(Long userId, DateRange fromToDateRange);
}
