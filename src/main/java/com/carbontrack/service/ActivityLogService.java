package com.carbontrack.service;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository repository;

    @Autowired
    private UserRepository userRepository;

    // Calculate Carbon Emission
    private double calculateCarbonEmission(String category, Double quantity) {

        if (quantity == null) {
            return 0;
        }

        switch (category) {

            case "Transportation":
                return quantity * 0.21;

            case "Electricity":
                return quantity * 0.82;

            case "Food":
                return quantity * 2.50;

            case "Waste":
                return quantity * 0.50;

            default:
                return 0;
        }
    }

    // Get Logged-in User
    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Save Activity
    public ActivityLog saveActivity(ActivityLog activity) {

        User user = getLoggedInUser();

        activity.setUser(user);

        double emission = calculateCarbonEmission(
                activity.getCategory(),
                activity.getQuantity()
        );

        activity.setCarbonEmission(emission);

        return repository.save(activity);
    }

    // Get Logged-in User Activities
    public List<ActivityLog> getAllActivities() {

        User user = getLoggedInUser();

        return repository.findByUser(user);
    }

    // Get Activity By Id
    public ActivityLog getActivityById(Long id) {

        User user = getLoggedInUser();

        ActivityLog activity = repository.findById(id).orElse(null);

        if (activity == null || !activity.getUser().getId().equals(user.getId())) {
            return null;
        }

        return activity;
    }

    // Update Activity
    public ActivityLog updateActivity(Long id, ActivityLog activity) {

        User user = getLoggedInUser();

        ActivityLog existing = repository.findById(id).orElse(null);

        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return null;
        }

        existing.setCategory(activity.getCategory());
        existing.setActivity(activity.getActivity());
        existing.setQuantity(activity.getQuantity());
        existing.setUnit(activity.getUnit());
        existing.setDate(activity.getDate());

        double emission = calculateCarbonEmission(
                activity.getCategory(),
                activity.getQuantity()
        );

        existing.setCarbonEmission(emission);

        return repository.save(existing);
    }

    // Delete Activity
    public void deleteActivity(Long id) {

        User user = getLoggedInUser();

        ActivityLog activity = repository.findById(id).orElse(null);

        if (activity != null && activity.getUser().getId().equals(user.getId())) {
            repository.deleteById(id);
        }
    }
}