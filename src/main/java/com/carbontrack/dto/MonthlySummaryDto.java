package com.carbontrack.dto;

import java.io.Serializable;

public class MonthlySummaryDto implements Serializable {

    private double totalFootprint;
    private int totalActivities;
    private double allTimeFootprint;
    private String bestCategory;
    private double bestCategoryScore;
    private double avgDailyFootprint;
    private boolean hasActiveGoal;
    private int badgesEarned;
    private int goalStreak;
    private int percentileRank;
    private RecentActivity recentActivity;

    public MonthlySummaryDto() {
    }

    public MonthlySummaryDto(double totalFootprint, int totalActivities, double allTimeFootprint, 
                             String bestCategory, double bestCategoryScore, double avgDailyFootprint) {
        this.totalFootprint = totalFootprint;
        this.totalActivities = totalActivities;
        this.allTimeFootprint = allTimeFootprint;
        this.bestCategory = bestCategory;
        this.bestCategoryScore = bestCategoryScore;
        this.avgDailyFootprint = avgDailyFootprint;
        this.hasActiveGoal = false;
        this.badgesEarned = 0;
        this.goalStreak = 0;
        this.percentileRank = 50;
        
        // Calculate recent activity trend
        this.recentActivity = new RecentActivity(
                totalFootprint / Math.max(1, totalActivities),
                bestCategory,
                bestCategoryScore,
                55
        );
    }

    // Getters and Setters
    public double getTotalFootprint() { return totalFootprint; }
    public void setTotalFootprint(double totalFootprint) { this.totalFootprint = totalFootprint; }

    public int getTotalActivities() { return totalActivities; }
    public void setTotalActivities(int totalActivities) { this.totalActivities = totalActivities; }

    public double getAllTimeFootprint() { return allTimeFootprint; }
    public void setAllTimeFootprint(double allTimeFootprint) { this.allTimeFootprint = allTimeFootprint; }

    public String getBestCategory() { return bestCategory; }
    public void setBestCategory(String bestCategory) { this.bestCategory = bestCategory; }

    public double getBestCategoryScore() { return bestCategoryScore; }
    public void setBestCategoryScore(double bestCategoryScore) { this.bestCategoryScore = bestCategoryScore; }

    public double getAvgDailyFootprint() { return avgDailyFootprint; }
    public void setAvgDailyFootprint(double avgDailyFootprint) { this.avgDailyFootprint = avgDailyFootprint; }

    public boolean isHasActiveGoal() { return hasActiveGoal; }
    public void setHasActiveGoal(boolean hasActiveGoal) { this.hasActiveGoal = hasActiveGoal; }

    public int getBadgesEarned() { return badgesEarned; }
    public void setBadgesEarned(int badgesEarned) { this.badgesEarned = badgesEarned; }

    public int getGoalStreak() { return goalStreak; }
    public void setGoalStreak(int goalStreak) { this.goalStreak = goalStreak; }

    public int getPercentileRank() { return percentileRank; }
    public void setPercentileRank(int percentileRank) { this.percentileRank = percentileRank; }

    public RecentActivity getRecentActivity() { return recentActivity; }
    public void setRecentActivity(RecentActivity recentActivity) { this.recentActivity = recentActivity; }

    // Inner class for recent activity
    public static class RecentActivity {
        private double trendPercentage;
        private String bestCategory;
        private double bestCategoryScore;
        private double avgDailyFootprint;

        public RecentActivity() {}

        public RecentActivity(double trendPercentage, String bestCategory, double bestCategoryScore, double avgDailyFootprint) {
            this.trendPercentage = trendPercentage;
            this.bestCategory = bestCategory;
            this.bestCategoryScore = bestCategoryScore;
            this.avgDailyFootprint = avgDailyFootprint;
        }

        public double getTrendPercentage() { return trendPercentage; }
        public void setTrendPercentage(double trendPercentage) { this.trendPercentage = trendPercentage; }

        public String getBestCategory() { return bestCategory; }
        public void setBestCategory(String bestCategory) { this.bestCategory = bestCategory; }

        public double getBestCategoryScore() { return bestCategoryScore; }
        public void setBestCategoryScore(double bestCategoryScore) { this.bestCategoryScore = bestCategoryScore; }

        public double getAvgDailyFootprint() { return avgDailyFootprint; }
        public void setAvgDailyFootprint(double avgDailyFootprint) { this.avgDailyFootprint = avgDailyFootprint; }
    }
}