package com.carbontrack.service;

import com.carbontrack.entity.Badge;
import com.carbontrack.entity.User;
import com.carbontrack.repository.BadgeRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    // ==========================
    // Logged-in User
    // ==========================
    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================
    // Get My Badges
    // ==========================
    public List<Badge> getMyBadges() {

        User user = getLoggedInUser();

        return badgeRepository.findByUser(user);
    }

    // ==========================
    // Award Badge
    // ==========================
    public Badge awardBadge(String name,
                            String description,
                            String triggerType,
                            Integer threshold) {

        User user = getLoggedInUser();

        // Prevent duplicate badges
        if (badgeRepository.findByUserAndName(user, name).isPresent()) {
            return null;
        }

        Badge badge = Badge.builder()
                .name(name)
                .description(description)
                .triggerType(triggerType)
                .threshold(threshold)
                .user(user)
                .earned(true)
                .earnedDate(LocalDate.now())
                .build();

        return badgeRepository.save(badge);
    }

}