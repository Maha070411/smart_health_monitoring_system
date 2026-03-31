package com.healthportal.backend.controller;

import com.healthportal.backend.entity.MedicalReport;
import com.healthportal.backend.repository.MedicalReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
public class MedicalReportController {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @PostMapping
    public ResponseEntity<?> uploadReport(@RequestBody MedicalReport report) {
        report.setUploadedAt(LocalDateTime.now());
        return ResponseEntity.ok(medicalReportRepository.save(report));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<?> getReportsByPatient(@PathVariable Long id) {
        return ResponseEntity.ok(medicalReportRepository.findByPatientId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReport(@PathVariable Long id) {
        return medicalReportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
