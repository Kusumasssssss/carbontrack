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

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.model}")
    private String groqModel;

    public ChatbotService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String chatWithAI(String userMessage, String language) {

        if (groqApiKey == null || groqApiKey.contains("your_default_api_key_here")) {
            return "Please configure your Groq API Key.";
        }

        String languageName = switch (language) {
            case "hi" -> "Hindi";
            case "kn" -> "Kannada";
            case "ta" -> "Tamil";
            case "te" -> "Telugu";
            default -> "English";
        };

        String systemPrompt = String.format("""
        You are CarbonTrack's friendly AI Sustainability Coach.

        Answer ONLY in %s.

        Answer questions about reducing carbon emissions, eco-friendly habits, and climate change.

        Keep responses short (1-3 sentences).

        Do not use markdown formatting.

        User:
        """, languageName);

        String prompt = systemPrompt + userMessage;

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
            return "Failed to construct API request.";
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return parseGroqResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return "Oops! I'm having trouble connecting to my brain right now. Please try again later.";
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
        return "I didn't quite catch that. Could you rephrase?";
    }
}
