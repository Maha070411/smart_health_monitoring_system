package com.healthportal.backend.controller;

import com.healthportal.backend.entity.Appointment;
import com.healthportal.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus(Appointment.Status.PENDING);
        if(appointment.getAppointmentDate() == null) {
            appointment.setAppointmentDate(LocalDateTime.now().plusDays(1));
        }
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentRepository.findByPatientId(id));
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Appointment statusData) {
        return appointmentRepository.findById(id).map(app -> {
            app.setStatus(statusData.getStatus());
            return ResponseEntity.ok(appointmentRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
