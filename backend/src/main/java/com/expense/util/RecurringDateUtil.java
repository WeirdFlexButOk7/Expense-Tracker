package com.expense.util;

import java.time.LocalDate;

import com.expense.enums.RecurringFrequencyEnum;

public class RecurringDateUtil {
    public static LocalDate calculateNextRunDate(RecurringFrequencyEnum frequency, LocalDate baseDate) {
        if(baseDate == null) {
            baseDate = LocalDate.now();
        }
        LocalDate nextRunDate = switch (frequency) {
            case DAILY -> baseDate.plusDays(1);
            case WEEKLY -> baseDate.plusWeeks(1);
            case MONTHLY -> baseDate.plusMonths(1);
            case YEARLY -> baseDate.plusYears(1);
        };
        if(nextRunDate.isBefore(LocalDate.now().plusDays(1))) {
            nextRunDate = LocalDate.now().plusDays(1);
        }
        return nextRunDate;
    }
}
