package com.carbontrack.controller;

import com.carbontrack.dto.ChatRequest;
import com.carbontrack.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "AI Sustainability Coach Chatbot", description = "Interactive conversational Q&A endpoint powered by Gemini AI")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    @Operation(summary = "Chat with AI Coach", description = "Sends user message prompt to Gemini AI and returns response")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String responseMessage = chatbotService.chatWithAI(request.getMessage());
        return ResponseEntity.ok(Map.of("response", responseMessage));
    }
}
