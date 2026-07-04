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

    // Save Activity
    public ActivityLog saveActivity(ActivityLog activity) {

        double emission = calculateCarbonEmission(
                activity.getCategory(),
                activity.getQuantity()
        );

        activity.setCarbonEmission(emission);

        System.out.println("========== SAVE ==========");
        System.out.println("Category : " + activity.getCategory());
        System.out.println("Quantity : " + activity.getQuantity());
        System.out.println("Emission : " + activity.getCarbonEmission());
        System.out.println("==========================");

        return repository.save(activity);
    }

    // Get All Activities
    public List<ActivityLog> getAllActivities() {
        return repository.findAll();
    }

    // Get Activity By Id
    public ActivityLog getActivityById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Activity
    public ActivityLog updateActivity(Long id, ActivityLog activity) {

        ActivityLog existing = repository.findById(id).orElse(null);

        if (existing == null) {
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

        System.out.println("========== UPDATE ==========");
        System.out.println("Category : " + existing.getCategory());
        System.out.println("Quantity : " + existing.getQuantity());
        System.out.println("Emission : " + existing.getCarbonEmission());
        System.out.println("============================");

        return repository.save(existing);
    }

    // Delete Activity
    public void deleteActivity(Long id) {
        repository.deleteById(id);
    }
}