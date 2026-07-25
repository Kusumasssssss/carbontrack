package com.carbontrack.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalDTO {

    private Long id;
    private BigDecimal targetReductionPct;
    private Integer periodDays;
    private LocalDate startDate;
    private LocalDate deadline;
    private String status;
}
