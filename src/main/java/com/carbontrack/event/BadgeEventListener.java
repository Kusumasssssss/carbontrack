package com.carbontrack.event;

import com.carbontrack.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class BadgeEventListener {

    @Autowired
    private BadgeService badgeService;

    @EventListener
    public void handleBadgeAward(BadgeAwardEvent event) {

        switch (event.getTriggerType()) {

            case "GOAL":

                badgeService.awardBadgeForUser(
                        event.getUser(),
                        "First Goal",
                        "Congratulations! You achieved your first goal.",
                        "GOAL",
                        1
                );

                break;

            case "STREAK":

                badgeService.awardBadgeForUser(
                        event.getUser(),
                        "7 Day Streak",
                        "Logged activities for 7 consecutive days.",
                        "STREAK",
                        7
                );

                break;

            case "REDUCTION10":

                badgeService.awardBadgeForUser(
                        event.getUser(),
                        "10kg Saver",
                        "Reduced 10kg of CO₂ emissions.",
                        "REDUCTION",
                        10
                );

                break;

            case "REDUCTION25":

                badgeService.awardBadgeForUser(
                        event.getUser(),
                        "25kg Saver",
                        "Reduced 25kg of CO₂ emissions.",
                        "REDUCTION",
                        25
                );

                break;

            case "REDUCTION50":

                badgeService.awardBadgeForUser(
                        event.getUser(),
                        "50kg Saver",
                        "Reduced 50kg of CO₂ emissions.",
                        "REDUCTION",
                        50
                );

                break;

            default:
                break;
        }
    }
}