package com.carbontrack.service;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import com.carbontrack.repository.ActivityLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RecommendationService recommendationService;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        // Since ObjectMapper is instantiated in the real service, we can inject it
        recommendationService = new RecommendationService(activityLogRepository, restTemplate, objectMapper);
        ReflectionTestUtils.setField(recommendationService, "groqApiKey", "dummy-api-key");
        ReflectionTestUtils.setField(recommendationService, "groqApiUrl", "http://dummy-groq-api");
        ReflectionTestUtils.setField(recommendationService, "groqModel", "llama3");
    }

    @Test
    public void testGetAIRecommendations_NoApiKey() {
        ReflectionTestUtils.setField(recommendationService, "groqApiKey", "your_default_api_key_here");
        String result = recommendationService.getAIRecommendations(new User());
        assertTrue(result.contains("Please configure your Groq API Key"));
    }

    @Test
    public void testGetAIRecommendations_NoActivities() {
        User user = new User();
        when(activityLogRepository.findTop3ByUserAndDateAfterOrderByCarbonEmissionDesc(eq(user), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        String result = recommendationService.getAIRecommendations(user);
        assertTrue(result.contains("You haven't logged any activities"));
    }

    @Test
    public void testGetAIRecommendations_Success() {
        User user = new User();
        ActivityLog log1 = new ActivityLog();
        log1.setActivity("Flight");
        log1.setCarbonEmission(150.0);

        when(activityLogRepository.findTop3ByUserAndDateAfterOrderByCarbonEmissionDesc(eq(user), any(LocalDate.class)))
                .thenReturn(Arrays.asList(log1));

        String mockGroqResponse = "{\n" +
                "  \"choices\": [\n" +
                "    {\n" +
                "      \"message\": {\n" +
                "        \"content\": \"Consider taking a train instead of flying.\"\n" +
                "      }\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        when(restTemplate.postForEntity(ArgumentMatchers.startsWith("http://dummy-groq-api"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(new ResponseEntity<>(mockGroqResponse, HttpStatus.OK));

        String result = recommendationService.getAIRecommendations(user);
        assertEquals("Consider taking a train instead of flying.", result);
    }
}
