package com.expense.repository;

import com.expense.entity.Transaction;
import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.datetime BETWEEN :start AND :end
        AND (:categoryType IS NULL OR t.category.type = :categoryType)
        AND (:categoryName IS NULL OR t.category.name = :categoryName)
        AND (:name = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:paymentMode = '' OR LOWER(t.paymentMode) LIKE LOWER(CONCAT('%', :paymentMode, '%')))
        AND (:note = '' OR LOWER(t.note) LIKE LOWER(CONCAT('%', :note, '%')))
        AND (:minAmount IS NULL OR t.amount >= :minAmount)
        AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
        ORDER BY t.datetime DESC
    """)
    List<Transaction> filterTransactions(
        Long userId,
        LocalDateTime start,
        LocalDateTime end,
        CategoryTypeEnum categoryType,
        CategoryNameEnum categoryName,
        String name,
        String paymentMode,
        String note,
        BigDecimal minAmount,
        BigDecimal maxAmount
    );

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
}
