package com.carbontrack.service;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FootprintAggregationService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Cacheable(value = "footprints", key = "#root.target.getLoggedInUserId() + '-daily'")
    public List<CategoryAggregation> getDailyAggregation() {
        User user = getLoggedInUser();
        LocalDate today = LocalDate.now();
        return activityLogRepository.findAggregatedFootprints(user, today, today);
    }

    @Cacheable(value = "footprints", key = "#root.target.getLoggedInUserId() + '-weekly'")
    public List<CategoryAggregation> getWeeklyAggregation() {
        User user = getLoggedInUser();
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        return activityLogRepository.findAggregatedFootprints(user, startOfWeek, today);
    }

    @Cacheable(value = "footprints", key = "#root.target.getLoggedInUserId() + '-monthly'")
    public List<CategoryAggregation> getMonthlyAggregation() {
        User user = getLoggedInUser();
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        return activityLogRepository.findAggregatedFootprints(user, startOfMonth, today);
    }

    // Public method for caching key generation
    public Long getLoggedInUserId() {
        return getLoggedInUser().getId();
    }
}
