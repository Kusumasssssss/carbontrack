package com.carbontrack.event;

import com.carbontrack.entity.ActivityLog;
import org.springframework.context.ApplicationEvent;

public class ActivityLoggedEvent extends ApplicationEvent {

    private final ActivityLog activityLog;

    public ActivityLoggedEvent(ActivityLog activityLog) {
        super(activityLog);
        this.activityLog = activityLog;
    }

    public ActivityLog getActivityLog() {
        return activityLog;
    }
}