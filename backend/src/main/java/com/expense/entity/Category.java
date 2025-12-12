package com.expense.entity;

import com.expense.enums.CategoryNameEnum;
import com.expense.enums.CategoryTypeEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.EnumType;
import jakarta.persistence.JoinColumn;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_name", nullable = false, columnDefinition = "category_name_enum")
    private CategoryNameEnum name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_type", nullable = false, columnDefinition = "category_type_enum")
    private CategoryTypeEnum type;

    @ToString.Exclude
    @OneToMany(mappedBy = "category")
    private List<Transaction> transactions;

    @ToString.Exclude
    @OneToMany(mappedBy = "category")
    private List<RecurringTransaction> recurringTransactions;
}
