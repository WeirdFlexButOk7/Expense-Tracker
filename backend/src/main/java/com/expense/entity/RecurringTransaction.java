package com.expense.entity;

import com.expense.enums.RecurringFrequencyEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.EnumType;
import jakarta.persistence.JoinColumn;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "recurring_transactions")
public class RecurringTransaction {

    @Id
    @ToString.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recurring_transaction_id")
    private Long id;

    @ManyToOne
    @ToString.Include
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @ToString.Include
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ToString.Include
    @Column(name = "recurring_transaction_name", nullable = false)
    private String name;

    @ToString.Include
    @Column(nullable = false)
    private BigDecimal amount;

    @ToString.Include
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecurringFrequencyEnum frequency;

    @ToString.Include
    @Column(name = "next_run_date", nullable = false)
    private LocalDate nextRunDate;
}
