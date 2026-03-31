package com.healthportal.backend.controller;

import com.healthportal.backend.entity.HealthData;
import com.healthportal.backend.repository.HealthDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health")
public class HealthDataController {

    @Autowired
    private HealthDataRepository healthDataRepository;

    @PostMapping
    public ResponseEntity<?> addHealthData(@RequestBody HealthData data) {
        data.setRecordedAt(LocalDateTime.now());
        return ResponseEntity.ok(healthDataRepository.save(data));
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> getHealthHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(healthDataRepository.findByPatientIdOrderByRecordedAtDesc(patientId));
    }
}
