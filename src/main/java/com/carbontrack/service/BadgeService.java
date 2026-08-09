package com.carbontrack.service;

import com.carbontrack.entity.Badge;
import com.carbontrack.entity.User;
import com.carbontrack.repository.BadgeRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.carbontrack.repository.ActivityLogRepository;
import java.time.LocalDate;

import java.time.LocalDate;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    // ==========================
    // Get Logged-in User
    // ==========================
    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================
    // Get My Badges
    // ==========================
    public List<Badge> getMyBadges() {

        User user = getLoggedInUser();

        return badgeRepository.findByUser(user);
    }

    // ==========================
    // Award Badge
    // ==========================

    // ==========================
    // Award Badge (User Explicit)
    // ==========================
    public Badge awardBadgeForUser(User user,
                                   String name,
                                   String description,
                                   String triggerType,
                                   Integer threshold) {

        if (user == null) {
            return null;
        }

        // Prevent duplicate badge
        if (badgeRepository.findByUserAndName(user, name).isPresent()) {
            return badgeRepository.findByUserAndName(user, name).get();
        }

        Badge badge = Badge.builder()
                .name(name)
                .description(description)
                .triggerType(triggerType)
                .threshold(threshold)
                .user(user)
                .earned(true)
                .earnedDate(LocalDate.now())
                .build();

        return badgeRepository.save(badge);
    }
    // ==========================
// Check Activity Badges
// ==========================
    public void checkActivityBadges() {

        User user = getLoggedInUser();

        // ---------- 7 Day Streak ----------
        Long activeDays = activityLogRepository.countActiveDays(
                user,
                LocalDate.now().minusDays(6)
        );

        if (activeDays >= 7) {

            awardBadge(
                    "7 Day Streak",
                    "Logged activities for 7 consecutive days.",
                    "STREAK",
                    7
            );
        }

        // ---------- Carbon Reduction ----------
        Double totalEmission =
                activityLogRepository.getTotalCarbonEmission(
                        user,
                        LocalDate.MIN,
                        LocalDate.now()
                );

        if (totalEmission <= 90) {

            awardBadge(
                    "10kg Saver",
                    "Reduced 10kg of CO₂ emissions.",
                    "REDUCTION",
                    10
            );
        }

        if (totalEmission <= 75) {

            awardBadge(
                    "25kg Saver",
                    "Reduced 25kg of CO₂ emissions.",
                    "REDUCTION",
                    25
            );
        }

        if (totalEmission <= 50) {

            awardBadge(
                    "50kg Saver",
                    "Reduced 50kg of CO₂ emissions.",
                    "REDUCTION",
                    50
            );
        }
    }

    // ==========================
    // Award Badge (Security Context)
    // ==========================
    public Badge awardBadge(String name,
                            String description,
                            String triggerType,
                            Integer threshold) {

        User user = getLoggedInUser();
        return awardBadgeForUser(user, name, description, triggerType, threshold);
    }

    // ==========================
    // Check & Award Automated Badges
    // ==========================
    public void checkAndAwardActivityBadges(User user) {
        if (user == null) return;

        // 1. Award "First Activity" Badge
        awardBadgeForUser(user, "First Activity", "Congratulations! You logged your first eco-friendly activity.", "ACTIVITY", 1);

        // 2. Check 7-day streak
        List<LocalDate> dates = activityLogRepository.findDistinctDatesByUserOrderByDateDesc(user);
        if (dates != null && !dates.isEmpty()) {
            int streak = 1;
            LocalDate prev = dates.get(0);
            for (int i = 1; i < dates.size(); i++) {
                LocalDate current = dates.get(i);
                if (prev.minusDays(1).equals(current)) {
                    streak++;
                    prev = current;
                } else {
                    break;
                }
            }

            if (streak >= 7) {
                awardBadgeForUser(user, "7 Day Streak", "Logged activities for 7 consecutive days.", "STREAK", 7);
            }
        }

        // 3. Check CO2e reduction thresholds
        Double totalCo2e = activityLogRepository.findTotalCarbonEmissionByUser(user);
        if (totalCo2e != null) {
            if (totalCo2e >= 10.0) {
                awardBadgeForUser(user, "10kg Saver", "Reduced 10kg of CO₂ emissions.", "REDUCTION", 10);
            }
            if (totalCo2e >= 25.0) {
                awardBadgeForUser(user, "25kg Saver", "Reduced 25kg of CO₂ emissions.", "REDUCTION", 25);
            }
            if (totalCo2e >= 50.0) {
                awardBadgeForUser(user, "50kg Saver", "Reduced 50kg of CO₂ emissions.", "REDUCTION", 50);
            }
        }
    }
}