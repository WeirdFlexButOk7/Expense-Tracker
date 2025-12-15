package com.expense.service;

import com.expense.entity.RecurringTransaction;
import com.expense.entity.Transaction;
import com.expense.entity.User;
import com.expense.repository.RecurringTransactionRepository;
import com.expense.repository.TransactionRepository;
import com.expense.repository.UserRepository;
import com.expense.util.BalanceUtil;
import com.expense.util.RecurringDateUtil;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecurringExecutionService {

    private final RecurringTransactionRepository recurringRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * *")  // midnight
    public void processRecurringTransactions() {
        LocalDate today = LocalDate.now();

        List<RecurringTransaction> dueList =
            recurringRepository.findAllByNextRunDateLessThanEqual(today);

        for (RecurringTransaction rt : dueList) {
            createTransactionFromRecurring(rt);
            updateNextRunDate(rt);
        }
    }

    private void createTransactionFromRecurring(RecurringTransaction rt) {
        User user = rt.getUser();
        BigDecimal change = BalanceUtil.calculateBalanceChange(rt.getAmount(), rt.getCategory());
        user.setBalance(user.getBalance().add(change));
        userRepository.save(user);

        Transaction t = new Transaction();
        t.setUser(rt.getUser());
        t.setCategory(rt.getCategory());
        t.setName("Automated by: " + rt.getName());
        t.setAmount(rt.getAmount());
        t.setDatetime(LocalDateTime.now());
        t.setPaymentMode("Automated by: " + rt.getName());
        t.setNote("Payment tracked automatically by recurring transaction");
        transactionRepository.save(t);
    }

    private void updateNextRunDate(RecurringTransaction rt) {
        LocalDate newDate = RecurringDateUtil.calculateNextRunDate(
            rt.getFrequency(),
            rt.getNextRunDate()
        );
        rt.setNextRunDate(newDate);
        recurringRepository.save(rt);
    }
}
