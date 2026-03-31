package com.healthportal.backend.controller;

import com.healthportal.backend.entity.Patient;
import com.healthportal.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient updateData) {
        return patientRepository.findById(id).map(patient -> {
            patient.setFirstName(updateData.getFirstName());
            patient.setLastName(updateData.getLastName());
            patient.setPhone(updateData.getPhone());
            patient.setAddress(updateData.getAddress());
            patient.setDob(updateData.getDob());
            patientRepository.save(patient);
            return ResponseEntity.ok(patient);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> getDashboardMock() {
        Map<String, Object> map = new HashMap<>();
        map.put("dashboardData", "mocked");
        return ResponseEntity.ok(map);
    }
}
