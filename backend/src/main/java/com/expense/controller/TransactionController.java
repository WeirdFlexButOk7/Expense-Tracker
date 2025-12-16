package com.expense.controller;

import com.expense.dto.TransactionRequest;
import com.expense.dto.TransactionResponse;
import com.expense.entity.Transaction;
import com.expense.entity.User;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.config.UserDetailsImpl;
import com.expense.service.TransactionService;
import com.expense.util.DateRange;
import com.expense.util.DateRangeUtil;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

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
        User user = ((UserDetailsImpl) authentication.getPrincipal()).getUser();
        Long userId = user.getId();
        DateRange fromToDateRange = DateRangeUtil.normalize(from, to , user.getCreatedAt());

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

    @PostMapping("/new")
    public ResponseEntity<Transaction> createTransaction(
        Authentication authentication,
        @Valid @RequestBody TransactionRequest req
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        Transaction created = transactionService.createTransaction(userId, req);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Transaction> updateTransaction(
        Authentication authentication,
        @PathVariable Long id,
        @Valid @RequestBody TransactionRequest req
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        Transaction updated = transactionService.updateTransaction(userId, id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTransaction(
        Authentication authentication,
        @PathVariable Long id
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.noContent().build();
    }
}
