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

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.model}")
    private String groqModel;

    public RecommendationService(ActivityLogRepository activityLogRepository, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.activityLogRepository = activityLogRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getAIRecommendations(User user) {
        if (groqApiKey == null || groqApiKey.contains("your_default_api_key_here")) {
            return "Please configure your Groq API Key in application.properties to see personalised recommendations.";
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

        return callGroqApi(prompt);
    }

    private String callGroqApi(String prompt) {
        String url = groqApiUrl;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        String requestBody;
        try {
            java.util.Map<String, String> userMessage = java.util.Map.of("role", "user", "content", prompt);
            java.util.Map<String, Object> body = java.util.Map.of(
                "model", groqModel,
                "messages", java.util.List.of(userMessage)
            );
            requestBody = objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Failed to construct API request: " + e.getMessage();
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return parseGroqResponse(response.getBody());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            e.printStackTrace();
            return "Oops! API Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Oops! We encountered an error while contacting the AI coach: " + e.getMessage();
        }
    }

    private String parseGroqResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                return message.path("content").asText();
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "Failed to parse AI response.";
    }
}
