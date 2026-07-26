package com.carbontrack.controller;

import com.carbontrack.entity.User;
import com.carbontrack.repository.UserRepository;
import com.carbontrack.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Personalised Recommendations (AI)", description = "Gemini AI recommendations generated based on user top carbon-emitting activities")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    public RecommendationController(RecommendationService recommendationService, UserRepository userRepository) {
        this.recommendationService = recommendationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get Personalized AI Insights", description = "Extracts top 3 emission activities and fetches personalized advice via Gemini API")
    public ResponseEntity<?> getRecommendations(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        String recommendations = recommendationService.getAIRecommendations(userOpt.get());
        return ResponseEntity.ok(Map.of("recommendations", recommendations));
    }
}
