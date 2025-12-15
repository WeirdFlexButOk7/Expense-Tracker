package com.expense.util;

import java.time.LocalDate;

import com.expense.enums.RecurringFrequencyEnum;

public class RecurringDateUtil {
    public static LocalDate calculateNextRunDate(RecurringFrequencyEnum frequency, LocalDate baseDate) {
        if (frequency == null || baseDate == null) {
            return null;
        }

        return switch (frequency) {
            case DAILY -> baseDate.plusDays(1);
            case WEEKLY -> baseDate.plusWeeks(1);
            case MONTHLY -> baseDate.plusMonths(1);
            case YEARLY -> baseDate.plusYears(1);
        };
    }
}
