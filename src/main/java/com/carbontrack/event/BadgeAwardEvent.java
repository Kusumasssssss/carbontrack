package com.carbontrack.event;

import com.carbontrack.entity.User;
import org.springframework.context.ApplicationEvent;

public class BadgeAwardEvent extends ApplicationEvent {

    private final User user;
    private final String triggerType;

    public BadgeAwardEvent(User user, String triggerType) {
        super(user);
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