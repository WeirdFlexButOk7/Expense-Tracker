package com.expense.util;

import java.time.LocalDate;

public class DateRangeUtil {

    public static DateRange normalize(LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now();

        if (from == null && to == null) { // both null, default last 30 days
            to = today;
            from = today.minusDays(30);
        } else if (from == null) { // from null, infer from
            from = to.minusDays(30);
        } else if (to == null) { // to null, infer to
            to = from.plusDays(30);
        } else if (from.isAfter(to)) { // both present, ensure order
            LocalDate temp = from;
            from = to;
            to = temp;
        }

        return new DateRange(from, to);
    }
}
