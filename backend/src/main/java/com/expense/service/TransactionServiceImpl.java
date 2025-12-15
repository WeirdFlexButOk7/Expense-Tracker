package com.expense.service;

import com.expense.dto.TransactionRequest;
import com.expense.dto.TransactionResponse;
import com.expense.entity.Category;
import com.expense.entity.Transaction;
import com.expense.entity.User;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;
import com.expense.repository.CategoryRepository;
import com.expense.repository.TransactionRepository;
import com.expense.repository.UserRepository;
import com.expense.util.BalanceUtil;
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
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public TransactionResponse getTransactions(
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

        return TransactionResponse.builder()
            .username(user.getUsername())
            .transactions(list)
            .transactionsCount(transactionsCount)
            .totalIncome(incomeTotal)
            .totalExpense(expenseTotal)
            .totalDelta(delta)
            .build();
    }

    public Transaction createTransaction(Long userId, TransactionRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Category category = categoryRepository
            .findByName(req.getCategoryName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        LocalDateTime currentTime = LocalDateTime.now();

        BigDecimal change = BalanceUtil.calculateBalanceChange(req.getAmount(), category);
        user.setBalance(user.getBalance().add(change));
        user = userRepository.save(user);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setName(req.getName());
        transaction.setAmount(req.getAmount());
        transaction.setDatetime(currentTime);
        transaction.setPaymentMode(req.getPaymentMode());
        transaction.setNote(req.getNote());

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long userId, Long id, TransactionRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Category category = categoryRepository
            .findByName(req.getCategoryName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        BigDecimal change = BalanceUtil.calculateBalanceChange(req.getAmount(), category);
        user.setBalance(user.getBalance().add(change));
        change = BalanceUtil.calculateBalanceChange(transaction.getAmount(), category).negate();
        user.setBalance(user.getBalance().add(change));
        user = userRepository.save(user);

        transaction.setCategory(category);
        transaction.setName(req.getName());
        transaction.setAmount(req.getAmount());
        transaction.setPaymentMode(req.getPaymentMode());
        transaction.setNote(req.getNote());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long userId, Long id) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        BigDecimal change = BalanceUtil.calculateBalanceChange(transaction.getAmount(), transaction.getCategory()).negate();
        user.setBalance(user.getBalance().add(change));
        user = userRepository.save(user);

        transactionRepository.delete(transaction);
    }
}
