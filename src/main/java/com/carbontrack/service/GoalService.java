package com.carbontrack.service;

import com.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.dto.GoalProgressDTO;
import com.carbontrack.entity.Goal;
import com.carbontrack.entity.User;
import com.carbontrack.event.BadgeAwardEvent;
import com.carbontrack.repository.GoalRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

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
    // Create Goal
    // ==========================
    public Goal createGoal(Goal goal) {

        User user = getLoggedInUser();

        LocalDate today = LocalDate.now();

        goal.setUser(user);
        goal.setStartDate(today);

        // Automatically calculate deadline
        goal.setDeadline(today.plusDays(goal.getPeriodDays()));

        goal.setStatus("ACTIVE");

        Goal savedGoal = goalRepository.save(goal);

        // Publish Spring Event
        eventPublisher.publishEvent(
                new BadgeAwardEvent(user, "GOAL")
        );

        return savedGoal;
    }

    // ==========================
    // Get All Goals
    // ==========================
    public List<Goal> getGoals() {

        User user = getLoggedInUser();

        return goalRepository.findByUser(user);
    }

    // ==========================
    // Get Active Goal
    // ==========================
    public Goal getActiveGoal() {

        User user = getLoggedInUser();

        return goalRepository
                .findByUserAndStatus(user, "ACTIVE")
                .orElse(null);
    }

    // ==========================
    // Goal Progress
    // ==========================
    public GoalProgressDTO getGoalProgress() {

        Goal goal = getActiveGoal();

        if (goal == null) {
            throw new RuntimeException("No active goal found");
        }

        LocalDate today = LocalDate.now();

        LocalDate deadline = goal.getDeadline();

        long daysElapsed = ChronoUnit.DAYS.between(
                goal.getStartDate(),
                today
        );

        long daysRemaining = ChronoUnit.DAYS.between(
                today,
                deadline
        );

        if (daysRemaining < 0) {
            daysRemaining = 0;
        }

        // Total carbon emission during goal period
        Double totalEmission = activityLogRepository.getTotalCarbonEmission(
                getLoggedInUser(),
                goal.getStartDate(),
                today
        );

// Temporary baseline (can be improved later)
        double baselineEmission = 100.0;

// Target emission based on goal
        double targetEmission =
                baselineEmission -
                        (baselineEmission * goal.getTargetReductionPct().doubleValue() / 100);

// Calculate progress
        double progressPercentage = 0;

        if (targetEmission > 0) {

            progressPercentage =
                    ((baselineEmission - totalEmission) /
                            (baselineEmission - targetEmission)) * 100;
        }

        if (progressPercentage < 0) {
            progressPercentage = 0;
        }

        if (progressPercentage > 100) {
            progressPercentage = 100;
        }

        boolean onTrack = progressPercentage >= 50;

        String message;

        if (progressPercentage == 0) {

            message = "🎯 Start logging eco-friendly activities to begin your goal.";

        } else if (progressPercentage >= 100) {

            message = "🏆 Congratulations! Goal achieved.";

        } else if (onTrack) {

            message = "🌱 Great! Keep reducing your carbon footprint.";

        } else {

            message = "⚠ Keep logging eco-friendly activities to reach your goal.";

        }

        return GoalProgressDTO.builder()
                .targetReduction(goal.getTargetReductionPct().doubleValue())
                .periodDays(goal.getPeriodDays())
                .daysElapsed(daysElapsed)
                .daysRemaining(daysRemaining)
                .progressPercentage(progressPercentage)
                .onTrack(onTrack)
                .message(message)
                .build();
    }

    // ==========================
    // Update Goal
    // ==========================
    public Goal updateGoal(Long id, Goal updatedGoal) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setTargetReductionPct(updatedGoal.getTargetReductionPct());
        goal.setPeriodDays(updatedGoal.getPeriodDays());

        // Recalculate deadline
        goal.setDeadline(
                goal.getStartDate().plusDays(goal.getPeriodDays())
        );

        return goalRepository.save(goal);
    }

    // ==========================
    // Delete Goal
    // ==========================
    public void deleteGoal(Long id) {

        goalRepository.deleteById(id);
    }
}