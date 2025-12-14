package com.expense.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @ToString.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
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
    @Column(nullable = false)
    private String name;

    @ToString.Include
    @Column(nullable = false)
    private BigDecimal amount;

    @ToString.Include
    @Column(nullable = false)
    private LocalDateTime datetime;

    @ToString.Include
    @Column(name = "payment_mode")
    private String paymentMode;

    @ToString.Include
    private String note;
}
