package com.carbontrack.service;

import com.carbontrack.entity.Goal;
import com.carbontrack.entity.User;
import com.carbontrack.repository.GoalRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    // Get Logged-in User
    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Create Goal
    public Goal createGoal(Goal goal) {

        User user = getLoggedInUser();

        goal.setUser(user);
        goal.setStartDate(LocalDate.now());
        goal.setStatus("ACTIVE");

        return goalRepository.save(goal);
    }

    // Get All Goals
    public List<Goal> getGoals() {

        User user = getLoggedInUser();

        return goalRepository.findByUser(user);
    }

    // Get Active Goal
    public Goal getActiveGoal() {

        User user = getLoggedInUser();

        return goalRepository
                .findByUserAndStatus(user, "ACTIVE")
                .orElse(null);
    }

    // Update Goal
    public Goal updateGoal(Long id, Goal updatedGoal) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setTargetReductionPct(updatedGoal.getTargetReductionPct());
        goal.setPeriodDays(updatedGoal.getPeriodDays());

        return goalRepository.save(goal);
    }

    // Delete Goal
    public void deleteGoal(Long id) {

        goalRepository.deleteById(id);
    }
}