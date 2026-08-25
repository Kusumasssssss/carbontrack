package com.carbontrack.controller;

import com.carbontrack.entity.Badge;
import com.carbontrack.service.BadgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Badges & Achievements", description = "Endpoints for retrieving user badges and rewards")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    // ==========================
    // Get Logged-in User Badges
    // ==========================
    @GetMapping
    @Operation(summary = "Get My Badges", description = "Retrieves all earned badges for the authenticated user")
    public List<Badge> getMyBadges() {
        return badgeService.getMyBadges();
    }

}