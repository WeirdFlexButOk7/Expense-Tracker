package com.expense.repository;

import com.expense.entity.RecurringTransaction;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findAllByUserId(Long userId);

    List<RecurringTransaction> findAllByNextRunDateLessThanEqual(LocalDate date);

    Optional<RecurringTransaction> findByIdAndUserId(Long id, Long userId);
}
