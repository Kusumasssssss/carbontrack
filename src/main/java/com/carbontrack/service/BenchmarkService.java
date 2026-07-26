package com.carbontrack.service;

import com.carbontrack.dto.BenchmarkDTO;
import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BenchmarkService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public BenchmarkDTO getPeerBenchmark() {
        User user = getLoggedInUser();

        Double userTotal = activityLogRepository.findTotalCarbonEmissionByUser(user);
        if (userTotal == null) {
            userTotal = 0.0;
        }

        List<Double> allUserTotals = activityLogRepository.findTotalCarbonEmissionsPerUser();
        double communityAvg = 0.0;
        double percentile = 50.0;
        String summary = "Average Eco-Performer";

        if (allUserTotals != null && !allUserTotals.isEmpty()) {
            double sum = 0.0;
            int countHigherEmissions = 0;

            for (Double val : allUserTotals) {
                if (val != null) {
                    sum += val;
                    if (val > userTotal) {
                        countHigherEmissions++;
                    }
                }
            }

            communityAvg = Math.round((sum / allUserTotals.size()) * 100.0) / 100.0;
            percentile = Math.round(((double) countHigherEmissions / allUserTotals.size()) * 100.0 * 10.0) / 10.0;

            if (percentile >= 75.0) {
                summary = "🌟 Top 25% Low-Carbon Pioneer";
            } else if (percentile >= 50.0) {
                summary = "🌱 Above Average Eco-Performer";
            } else if (percentile >= 25.0) {
                summary = "⚖️ Moderate Carbon Footprint";
            } else {
                summary = "⚠️ High Impact - High Reduction Opportunity";
            }
        }

        List<CategoryAggregation> categoryAverages = activityLogRepository.findPlatformCategoryAverages();
        if (categoryAverages == null) {
            categoryAverages = Collections.emptyList();
        }

        return BenchmarkDTO.builder()
                .userTotalFootprint(Math.round(userTotal * 100.0) / 100.0)
                .communityAverageFootprint(communityAvg)
                .percentileRanking(percentile)
                .standingSummary(summary)
                .categoryAverages(categoryAverages)
                .build();
    }
}
