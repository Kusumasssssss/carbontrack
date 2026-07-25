package com.carbontrack.controller;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.service.FootprintAggregationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/footprint")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Footprint Aggregation Engine", description = "Endpoints for cached daily, weekly, and monthly carbon footprint summaries")
public class FootprintController {

    @Autowired
    private FootprintAggregationService aggregationService;

    @GetMapping("/daily")
    @Operation(summary = "Get Daily Footprint Aggregation", description = "Retrieves Redis-cached daily category emissions")
    public List<CategoryAggregation> getDailyFootprint() {
        return aggregationService.getDailyAggregation();
    }

    @GetMapping("/weekly")
    @Operation(summary = "Get Weekly Footprint Aggregation", description = "Retrieves Redis-cached weekly category emissions")
    public List<CategoryAggregation> getWeeklyFootprint() {
        return aggregationService.getWeeklyAggregation();
    }

    @GetMapping("/monthly")
    @Operation(summary = "Get Monthly Footprint Aggregation", description = "Retrieves Redis-cached monthly category emissions")
    public List<CategoryAggregation> getMonthlyFootprint() {
        return aggregationService.getMonthlyAggregation();
    }
}
