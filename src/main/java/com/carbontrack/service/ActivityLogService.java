package com.carbontrack.service;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.repository.EmissionFactorRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

        System.out.println("========== EMISSION DEBUG ==========");
        System.out.println("Activity Type Received: " + activityType);
        System.out.println("Quantity: " + quantity);

        if (quantity == null) {
            System.out.println("Quantity is NULL");
            return 0;
        }

        EmissionFactor factor = emissionFactorRepository
                .findByActivityTypeIgnoreCase(activityType)
                .orElse(null);

        if (factor == null) {
            System.out.println("Emission Factor NOT FOUND!");
            return 0;
        }

        System.out.println("Factor Found: " + factor.getKgCo2ePerUnit());

        double emission = quantity * factor.getKgCo2ePerUnit().doubleValue();

        System.out.println("Calculated Emission: " + emission);
        System.out.println("===================================");

        return emission;
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
    @org.springframework.cache.annotation.CacheEvict(value = "footprints", allEntries = true)
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
    @org.springframework.cache.annotation.CacheEvict(value = "footprints", allEntries = true)
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
    @org.springframework.cache.annotation.CacheEvict(value = "footprints", allEntries = true)
    public void deleteActivity(Long id) {

        User user = getLoggedInUser();

        ActivityLog activity = repository.findById(id).orElse(null);

        if (activity != null && activity.getUser().getId().equals(user.getId())) {
            repository.deleteById(id);
        }
    }

    // ==================================================
    // Carbon Breakdown (Last 30 Days)
    // ==================================================
    public List<CategoryAggregation> getCarbonBreakdown() {

        User user = getLoggedInUser();

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        return repository.findAggregatedFootprints(
                user,
                startDate,
                endDate
        );
    }
}