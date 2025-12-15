package com.expense.dto;

import com.expense.enums.CategoryNameEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotNull(message = "Category name is required")
    private CategoryNameEnum categoryName;

    @NotBlank(message = "Name of transaction is required")
    private String name;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotBlank(message = "Payment mode is required")
    private String paymentMode;

    private String note;
}
