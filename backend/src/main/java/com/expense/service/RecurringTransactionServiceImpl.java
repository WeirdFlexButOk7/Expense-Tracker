package com.expense.service;

import com.expense.dto.RecurringTransactionRequest;
import com.expense.entity.Category;
import com.expense.entity.RecurringTransaction;
import com.expense.entity.User;
import com.expense.repository.CategoryRepository;
import com.expense.repository.RecurringTransactionRepository;
import com.expense.repository.UserRepository;
import com.expense.util.RecurringDateUtil;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecurringTransactionServiceImpl implements RecurringTransactionService {

    private final RecurringTransactionRepository recurringRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public List<RecurringTransaction> getRecurringTransactions(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return recurringRepository.findAllByUserId(userId);
    }

    @Override
    public RecurringTransaction createRecurringTransaction(Long userId, RecurringTransactionRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Category category = categoryRepository
            .findByName(req.getCategoryName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        RecurringTransaction rt = new RecurringTransaction();
        rt.setUser(user);
        rt.setCategory(category);
        rt.setName(req.getName());
        rt.setAmount(req.getAmount());
        rt.setFrequency(req.getFrequency());
        rt.setNextRunDate(
            RecurringDateUtil.calculateNextRunDate(req.getFrequency(), req.getNextRunDate())
        );

        return recurringRepository.save(rt);
    }

    @Override
    public RecurringTransaction updateRecurringTransaction(Long userId, Long id, RecurringTransactionRequest req) {
        Category category = categoryRepository
            .findByName(req.getCategoryName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        RecurringTransaction rt = recurringRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurring transaction not found"));

        if (req.getFrequency() != rt.getFrequency()) {
            rt.setNextRunDate(
                RecurringDateUtil.calculateNextRunDate(req.getFrequency(), req.getNextRunDate())
            );
        }

        rt.setCategory(category);
        rt.setName(req.getName());
        rt.setAmount(req.getAmount());
        rt.setFrequency(req.getFrequency());

        return recurringRepository.save(rt);
    }

    @Override
    public void deleteRecurringTransaction(Long userId, Long id) {
        RecurringTransaction rt = recurringRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurring transaction not found"));

        recurringRepository.delete(rt);
    }
}
