package com.carbontrack.service;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.repository.EmissionFactorRepository;
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

    @Autowired
    private EmissionFactorRepository emissionFactorRepository;

    // Calculate Carbon Emission
    public double calculateCarbonEmission(String activityType, Double quantity) {

        if (quantity == null) {
            return 0;
        }

        EmissionFactor factor = emissionFactorRepository.findByActivityType(activityType)
                .orElse(null);

        if (factor == null) {
            return 0;
        }

        return quantity * factor.getKgCo2ePerUnit().doubleValue();
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
                activity.getActivity(),
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
                activity.getActivity(),
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