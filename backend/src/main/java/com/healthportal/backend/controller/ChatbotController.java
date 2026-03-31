package com.healthportal.backend.controller;

import com.healthportal.backend.entity.ChatbotLog;
import com.healthportal.backend.repository.ChatbotLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotLogRepository repository;

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody ChatbotLog log) {
        log.setAskTime(LocalDateTime.now());
        log.setAnswer("I am an AI assistant. Based on '" + log.getQuestion() + "', please consult a real doctor for accurate medical advice.");
        return ResponseEntity.ok(repository.save(log));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<?> getHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(repository.findByPatientIdOrderByAskTimeAsc(patientId));
    }
}
