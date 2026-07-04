package com.carbontrack.service;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository repository;

    // Save Activity
    public ActivityLog saveActivity(ActivityLog activity) {
        return repository.save(activity);
    }

    // Get All Activities
    public List<ActivityLog> getAllActivities() {
        return repository.findAll();
    }

    // Delete Activity
    public void deleteActivity(Long id) {
        repository.deleteById(id);
    }
}