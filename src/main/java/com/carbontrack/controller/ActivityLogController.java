package com.carbontrack.controller;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.service.ActivityLogService;
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
    public ActivityLog saveActivity(@RequestBody ActivityLog activity) {
        return service.saveActivity(activity);
    }

    // Get All Activities
    @GetMapping
    public List<ActivityLog> getActivities() {
        return service.getAllActivities();
    }

    // Delete Activity
    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        service.deleteActivity(id);
    }
}