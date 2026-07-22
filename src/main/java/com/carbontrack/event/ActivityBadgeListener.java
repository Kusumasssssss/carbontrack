package com.carbontrack.event;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ActivityBadgeListener {

    @Autowired
    private BadgeService badgeService;

    @EventListener
    public void handleActivityLogged(ActivityLoggedEvent event) {

        ActivityLog activity = event.getActivityLog();

        System.out.println("=================================");
        System.out.println("Activity Logged Event Received");
        System.out.println("Activity : " + activity.getActivity());
        System.out.println("Carbon : " + activity.getCarbonEmission());
        System.out.println("=================================");

        // Award First Activity Badge
        badgeService.awardBadge(
                "First Activity",
                "Congratulations! You logged your first eco-friendly activity.",
                "ACTIVITY",
                1
        );
    }
}