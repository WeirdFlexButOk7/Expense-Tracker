package com.expense.util;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateRangeUtil {

    public static DateRange normalize(LocalDate from, LocalDate to, LocalDateTime userCreatedAt) {
        LocalDate today = LocalDate.now();
        LocalDate createdAt = userCreatedAt.toLocalDate();

        if (from == null) from = createdAt;
        if (to == null) to = today;
        if (from.isAfter(to)) {
            LocalDate temp = from;
            from = to;
            to = temp;
        }
        
        from = from.isBefore(createdAt) ? createdAt : from;
        to = to.isAfter(today) ? today : to;

        return new DateRange(from, to);
    }
}
