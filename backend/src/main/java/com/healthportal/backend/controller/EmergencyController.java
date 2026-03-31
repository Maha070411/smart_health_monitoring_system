package com.healthportal.backend.controller;

import com.healthportal.backend.entity.EmergencyAlert;
import com.healthportal.backend.repository.EmergencyAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    @Autowired
    private EmergencyAlertRepository repository;

    @PostMapping
    public ResponseEntity<?> triggerSOS(@RequestBody EmergencyAlert alert) {
        alert.setTriggeredAt(LocalDateTime.now());
        alert.setStatus(EmergencyAlert.AlertStatus.ACTIVE);
        return ResponseEntity.ok(repository.save(alert));
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> viewAlerts(@PathVariable Long patientId) {
        return ResponseEntity.ok(repository.findByPatientId(patientId));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id) {
        return repository.findById(id).map(a -> {
            a.setStatus(EmergencyAlert.AlertStatus.RESOLVED);
            return ResponseEntity.ok(repository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }
}
