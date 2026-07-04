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

    @PostMapping
    public ActivityLog saveActivity(@RequestBody ActivityLog activity) {
        return service.saveActivity(activity);
    }

    @GetMapping
    public List<ActivityLog> getActivities() {
        return service.getAllActivities();
    }

    @GetMapping("/{id}")
    public ActivityLog getActivity(@PathVariable Long id) {
        return service.getActivityById(id);
    }

    @PutMapping("/{id}")
    public ActivityLog updateActivity(
            @PathVariable Long id,
            @RequestBody ActivityLog activity) {

        return service.updateActivity(id, activity);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        service.deleteActivity(id);
    }
}