package com.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.expense.enums.CategoryNameEnum;
import com.expense.enums.RecurringFrequencyEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecurringTransactionRequest {

    @NotNull(message = "Category name is required")
    private CategoryNameEnum categoryName;

    @NotBlank(message = "Name of recurring transaction is required")
    private String name;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Frequency of recurring transaction is required")
    private RecurringFrequencyEnum frequency;

    private LocalDate nextRunDate;
}
