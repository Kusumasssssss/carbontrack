package com.carbontrack.dto;

import java.io.Serializable;

public class CategoryAggregation implements Serializable {

    private String category;
    private Double totalCo2e;

    public CategoryAggregation() {
    }

    public CategoryAggregation(String category, Double totalCo2e) {
        this.category = category;
        this.totalCo2e = totalCo2e;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getTotalCo2e() {
        return totalCo2e;
    }

    public void setTotalCo2e(Double totalCo2e) {
        this.totalCo2e = totalCo2e;
    }
}
