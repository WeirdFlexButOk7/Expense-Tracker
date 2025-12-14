package com.expense.controller;

import com.expense.dto.TransactionResponse;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.config.UserDetailsImpl;
import com.expense.service.TransactionService;
import com.expense.util.DateRange;
import com.expense.util.DateRangeUtil;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<TransactionResponse> getTransactions(
        Authentication authentication,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false, defaultValue = "ALL") String categoryType,
        @RequestParam(required = false, defaultValue = "ALL") String categoryName,
        @RequestParam(required = false, defaultValue = "") String name,
        @RequestParam(required = false, defaultValue = "") String paymentMode,
        @RequestParam(required = false, defaultValue = "") String note,
        @RequestParam(required = false) BigDecimal minAmount,
        @RequestParam(required = false) BigDecimal maxAmount
    ) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        DateRange fromToDateRange = DateRangeUtil.normalize(from, to);

        CategoryTypeEnum categoryTypeEnum = categoryType.equalsIgnoreCase("ALL") ? null : CategoryTypeEnum.valueOf(categoryType);
        CategoryNameEnum categoryNameEnum = categoryName.equalsIgnoreCase("ALL") ? null : CategoryNameEnum.valueOf(categoryName);

        TransactionResponse response =
            transactionService.getTransactions(
                userId,
                fromToDateRange,
                categoryTypeEnum,
                categoryNameEnum,
                name,
                paymentMode,
                note,
                minAmount,
                maxAmount
            );

        return ResponseEntity.ok(response);
    }
}
