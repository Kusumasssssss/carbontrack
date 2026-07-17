package com.carbontrack.service;

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

@Service
public class ChatbotService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public ChatbotService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String chatWithAI(String userMessage) {
        if (geminiApiKey == null || geminiApiKey.contains("your_default_api_key_here")) {
            return "Please configure your Gemini API Key in application.properties to chat with me.";
        }

        String systemPrompt = "You are CarbonTrack's friendly AI Sustainability Coach. Answer the user's questions about reducing carbon emissions, eco-friendly habits, and climate change in a concise, encouraging way. Do not use markdown formatting like **bold** in your responses. Keep responses brief (1-3 sentences).\n\nUser: ";
        String prompt = systemPrompt + userMessage;

        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody;
        try {
            java.util.Map<String, Object> part = java.util.Map.of("text", prompt);
            java.util.Map<String, Object> content = java.util.Map.of("parts", java.util.List.of(part));
            java.util.Map<String, Object> body = java.util.Map.of("contents", java.util.List.of(content));
            requestBody = objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Failed to construct API request.";
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return parseGeminiResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return "Oops! I'm having trouble connecting to my brain right now. Please try again later.";
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
        return "I didn't quite catch that. Could you rephrase?";
    }
}
