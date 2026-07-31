package com.carbontrack.service;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ActivityLogRepository activityLogRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public RecommendationService(ActivityLogRepository activityLogRepository, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.activityLogRepository = activityLogRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getAIRecommendations(User user) {
        if (geminiApiKey == null || geminiApiKey.contains("your_default_api_key_here")) {
            return "Please configure your Gemini API Key in application.properties to see personalised recommendations.";
        }

        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<ActivityLog> topActivities = activityLogRepository.findTop3ByUserAndDateAfterOrderByCarbonEmissionDesc(user, thirtyDaysAgo);

        if (topActivities.isEmpty()) {
            return "You haven't logged any activities in the last 30 days. Start logging to get personalised insights!";
        }

        String activitySummary = topActivities.stream()
                .map(a -> String.format("- %s (%.2f kg CO2)", a.getActivity(), a.getCarbonEmission()))
                .collect(Collectors.joining("\n"));

        String prompt = "Act as an eco-friendly sustainability coach. Based on the user's highest emission activities from the last 30 days:\n" +
                activitySummary +
                "\nProvide 3 short, actionable, and encouraging bullet points on how they can reduce their footprint. Do not use markdown bolding.";

        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody;
        try {
            java.util.Map<String, String> part = java.util.Map.of("text", prompt);
            java.util.Map<String, Object> content = java.util.Map.of("parts", java.util.List.of(part));
            java.util.Map<String, Object> body = java.util.Map.of("contents", java.util.List.of(content));
            requestBody = objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Failed to construct API request: " + e.getMessage();
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return parseGeminiResponse(response.getBody());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            e.printStackTrace();
            return "Oops! API Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Oops! We encountered an error while contacting the AI coach: " + e.getMessage();
        }
    }

    private String parseGeminiResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "Failed to parse AI response.";
    }
}
