package com.carbontrack.controller;

import com.carbontrack.entity.Goal;
import com.carbontrack.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // ==========================
    // Create Goal
    // ==========================
    @PostMapping
    public Goal createGoal(@Valid @RequestBody Goal goal) {
        return goalService.createGoal(goal);
    }

    // ==========================
    // Get All Goals
    // ==========================
    @GetMapping
    public List<Goal> getGoals() {
        return goalService.getGoals();
    }

    // ==========================
    // Get Active Goal
    // ==========================
    @GetMapping("/active")
    public Goal getActiveGoal() {
        return goalService.getActiveGoal();
    }

    // ==========================
    // Update Goal
    // ==========================
    @PutMapping("/{id}")
    public Goal updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody Goal goal) {

        return goalService.updateGoal(id, goal);
    }

    // ==========================
    // Delete Goal
    // ==========================
    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}