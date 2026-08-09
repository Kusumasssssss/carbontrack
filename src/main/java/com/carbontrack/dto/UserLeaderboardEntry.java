package com.carbontrack.dto;

import java.io.Serializable;

public class UserLeaderboardEntry implements Serializable {

    private Long userId;
    private String username;
    private Double totalFootprint;

    public UserLeaderboardEntry() {
    }

    public UserLeaderboardEntry(Long userId, String username, Double totalFootprint) {
        this.userId = userId;
        this.username = username;
        this.totalFootprint = totalFootprint;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Double getTotalFootprint() {
        return totalFootprint;
    }

    public void setTotalFootprint(Double totalFootprint) {
        this.totalFootprint = totalFootprint;
    }
}
