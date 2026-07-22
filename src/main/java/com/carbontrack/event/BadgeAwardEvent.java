package com.carbontrack.event;

import com.carbontrack.entity.User;

public class BadgeAwardEvent {

    private final User user;
    private final String triggerType;

    public BadgeAwardEvent(User user, String triggerType) {
        this.user = user;
        this.triggerType = triggerType;
    }

    public User getUser() {
        return user;
    }

    public String getTriggerType() {
        return triggerType;
    }
}