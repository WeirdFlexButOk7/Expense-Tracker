package com.expense.controller;

import com.expense.config.UserDetailsImpl;
import com.expense.dto.DashboardResponse;
import com.expense.service.DashboardService;
import com.expense.util.DateRangeUtil;
import com.expense.util.DateRange;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import java.time.LocalDate;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
        Authentication authentication,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {

        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        DateRange fromToDateRange = DateRangeUtil.normalize(from, to);

        DashboardResponse response = dashboardService.getDashboardData(userId, fromToDateRange);
        return ResponseEntity.ok(response);
    }
}
