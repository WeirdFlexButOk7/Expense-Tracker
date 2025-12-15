package com.expense.entity;

import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @ToString.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @ToString.Include
    @Enumerated(EnumType.STRING)
    @Column(name = "category_name", nullable = false)
    private CategoryNameEnum name;

    @ToString.Include
    @Enumerated(EnumType.STRING)
    @Column(name = "category_type", nullable = false)
    private CategoryTypeEnum type;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<RecurringTransaction> recurringTransactions;
}
