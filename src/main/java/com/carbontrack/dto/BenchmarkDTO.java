package com.carbontrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchmarkDTO {
    private Double userTotalFootprint;
    private Double communityAverageFootprint;
    private Double percentileRanking; // e.g. 75.0 means user is cleaner than 75% of users
    private String standingSummary;   // e.g. "Top 25% Eco-Performer"
    private List<CategoryAggregation> categoryAverages;
}
