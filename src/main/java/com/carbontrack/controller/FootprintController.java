package com.carbontrack.controller;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.service.FootprintAggregationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/footprint")
@CrossOrigin(origins = "http://localhost:3000")
public class FootprintController {

    @Autowired
    private FootprintAggregationService aggregationService;

    @GetMapping("/daily")
    public List<CategoryAggregation> getDailyFootprint() {
        return aggregationService.getDailyAggregation();
    }

    @GetMapping("/weekly")
    public List<CategoryAggregation> getWeeklyFootprint() {
        return aggregationService.getWeeklyAggregation();
    }

    @GetMapping("/monthly")
    public List<CategoryAggregation> getMonthlyFootprint() {
        return aggregationService.getMonthlyAggregation();
    }
}
