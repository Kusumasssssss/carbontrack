package com.carbontrack.controller;

import com.carbontrack.entity.Badge;
import com.carbontrack.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin(origins = "http://localhost:3000")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    // ==========================
    // Get Logged-in User Badges
    // ==========================
    @GetMapping
    public List<Badge> getMyBadges() {
        return badgeService.getMyBadges();
    }

}