package com.carbontrack.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalProgressDTO {

    private double targetReduction;

    private int periodDays;

    private long daysRemaining;

    private long daysElapsed;

    private double progressPercentage;

    private boolean onTrack;

    private String message;
}