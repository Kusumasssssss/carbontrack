package com.carbontrack.service;

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

        double progressPercentage = 0;

        if (goal.getPeriodDays() > 0) {
            progressPercentage =
                    ((double) daysElapsed / goal.getPeriodDays()) * 100;
        }

        if (progressPercentage > 100) {
            progressPercentage = 100;
        }

        if (progressPercentage > 100) {
            progressPercentage = 100;
        }

        boolean onTrack;

// A newly created goal should not be marked as behind
        if (daysElapsed == 0) {
            onTrack = true;
        } else {
            onTrack = progressPercentage >= 50;
        }

        String message;

        if (daysElapsed == 0) {

            message = "🎉 Great! Your goal has been created. Start logging eco-friendly activities to begin tracking your progress.";

        } else if (onTrack) {

            message = "🌱 Excellent! You're on track to achieve your carbon reduction goal.";

        } else {

            message = "⚠ You're falling behind. Try logging more eco-friendly activities to stay on track.";

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