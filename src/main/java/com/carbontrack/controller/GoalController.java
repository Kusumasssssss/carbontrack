package com.carbontrack.controller;

import com.carbontrack.dto.GoalDTO;
import com.carbontrack.dto.GoalProgressDTO;
import com.carbontrack.entity.Goal;
import com.carbontrack.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Goal Management", description = "APIs for creating, tracking, and evaluating carbon reduction targets")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // ==========================
    // Create Goal
    // ==========================
    @PostMapping
    @Operation(summary = "Create Goal", description = "Sets a new target reduction percentage and period")
    public ResponseEntity<GoalDTO> createGoal(@RequestBody Goal goal) {
        GoalDTO created = goalService.createGoal(goal);
        return ResponseEntity.ok(created);
    }

    // ==========================
    // Get All Goals
    // ==========================
    @GetMapping
    @Operation(summary = "Get All Goals", description = "Retrieves all historic and active goals for the user")
    public ResponseEntity<List<GoalDTO>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    // ==========================
    // Get Active Goal
    // ==========================
    @GetMapping("/active")
    @Operation(summary = "Get Active Goal", description = "Retrieves the user's currently active goal")
    public ResponseEntity<GoalDTO> getActiveGoal() {
        GoalDTO goal = goalService.getActiveGoal();
        if (goal == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(goal);
    }

    // ==========================
    // Get Goal Progress
    // ==========================
    @GetMapping("/progress")
    @Operation(summary = "Get Goal Progress", description = "Calculates elapsed time, percentage progress, on-track status, and motivational message")
    public ResponseEntity<GoalProgressDTO> getGoalProgress() {
        GoalProgressDTO progress = goalService.getGoalProgress();
        if (progress == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(progress);
    }

    // ==========================
    // Update Goal
    // ==========================
    @PutMapping("/{id}")
    @Operation(summary = "Update Goal")
    public ResponseEntity<GoalDTO> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.updateGoal(id, goal));
    }

    // ==========================
    // Delete Goal
    // ==========================
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Goal")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}