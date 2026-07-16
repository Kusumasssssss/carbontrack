package com.carbontrack.controller;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.ActivityLog;
import com.carbontrack.service.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityLogController {

    @Autowired
    private ActivityLogService service;

    // Save Activity
    @PostMapping
    public ActivityLog saveActivity(@Valid @RequestBody ActivityLog activity) {
        return service.saveActivity(activity);
    }

    // Get All Activities
    @GetMapping
    public List<ActivityLog> getActivities() {
        return service.getAllActivities();
    }

    // Get Activity By Id
    @GetMapping("/{id}")
    public ActivityLog getActivity(@PathVariable Long id) {
        return service.getActivityById(id);
    }

    // Update Activity
    @PutMapping("/{id}")
    public ActivityLog updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityLog activity) {

        return service.updateActivity(id, activity);
    }

    // Delete Activity
    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        service.deleteActivity(id);
    }

    // ===============================
    // Carbon Breakdown API
    // ===============================
    @GetMapping("/breakdown")
    public List<CategoryAggregation> getCarbonBreakdown() {
        return service.getCarbonBreakdown();
    }
}