package com.expense.repository;

import com.expense.entity.Transaction;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.datetime BETWEEN :start AND :end
        AND t.category.type = :type
        AND (:name IS NULL OR t.category.name = :name)
    """)
    BigDecimal sumAmountByCategory(Long userId, LocalDateTime start, LocalDateTime end, CategoryTypeEnum type, CategoryNameEnum name);

    @Query("""
        SELECT COUNT(t)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.datetime BETWEEN :start AND :end
        AND t.category.type = :type
        AND (:name IS NULL OR t.category.name = :name)
    """)
    long countTransactionsByCategory(Long userId, LocalDateTime start, LocalDateTime end, CategoryTypeEnum type, CategoryNameEnum name);

    @Query("""
        SELECT t.category.name AS category, COALESCE(COUNT(t), 0), COUNT(t)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.datetime BETWEEN :start AND :end
        AND t.category.type = 'EXPENSE'
        GROUP BY t.category.name
    """)
    List<Object[]> expenseBreakdown(Long userId, LocalDateTime start, LocalDateTime end);
}
