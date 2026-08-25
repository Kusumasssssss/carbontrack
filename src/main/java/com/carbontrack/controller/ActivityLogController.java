package com.carbontrack.controller;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.ActivityLog;
import com.carbontrack.service.ActivityLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Activity Logging", description = "Endpoints for logging, managing, and calculating carbon emissions of daily activities")
public class ActivityLogController {

    @Autowired
    private ActivityLogService service;

    // Save Activity
    @PostMapping
    @Operation(summary = "Log Activity", description = "Calculates CO2e and logs a new activity for the user")
    public ActivityLog saveActivity(@Valid @RequestBody ActivityLog activity) {
        return service.saveActivity(activity);
    }

    // Get All Activities
    @GetMapping
    @Operation(summary = "Get All Activities", description = "Retrieves all logged activities for the user")
    public List<ActivityLog> getActivities() {
        return service.getAllActivities();
    }

    // Get Activity By Id
    @GetMapping("/{id}")
    @Operation(summary = "Get Activity By ID")
    public ActivityLog getActivity(@PathVariable Long id) {
        return service.getActivityById(id);
    }

    // Update Activity
    @PutMapping("/{id}")
    @Operation(summary = "Update Activity", description = "Updates an existing activity log and recalculates emissions")
    public ActivityLog updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityLog activity) {

        return service.updateActivity(id, activity);
    }

    // Delete Activity
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Activity")
    public void deleteActivity(@PathVariable Long id) {
        service.deleteActivity(id);
    }

    // ===============================
    // Carbon Breakdown API
    // ===============================
    @GetMapping("/breakdown")
    @Operation(summary = "Get Carbon Breakdown", description = "Category-wise aggregated carbon footprint over the last 30 days")
    public List<CategoryAggregation> getCarbonBreakdown() {
        return service.getCarbonBreakdown();
    }
}