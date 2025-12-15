package com.expense.controller;

import com.expense.dto.RecurringTransactionRequest;
import com.expense.entity.RecurringTransaction;
import com.expense.config.UserDetailsImpl;
import com.expense.service.RecurringTransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recurring")
public class RecurringTransactionsController {

    private final RecurringTransactionService recurringService;

    @GetMapping
    public ResponseEntity<List<RecurringTransaction>> listRecurring(
        Authentication authentication
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        return ResponseEntity.ok(recurringService.getRecurringTransactions(userId));
    }

    @PostMapping("/new")
    public ResponseEntity<RecurringTransaction> createRecurring(
        Authentication authentication,
        @Valid @RequestBody RecurringTransactionRequest req
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        RecurringTransaction created = recurringService.createRecurringTransaction(userId, req);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RecurringTransaction> updateRecurring(
        Authentication authentication,
        @PathVariable Long id,
        @Valid @RequestBody RecurringTransactionRequest req
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        RecurringTransaction updated = recurringService.updateRecurringTransaction(userId, id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRecurring(
        Authentication authentication,
        @PathVariable Long id
    ) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        recurringService.deleteRecurringTransaction(userId, id);
        return ResponseEntity.noContent().build();
    }
}
