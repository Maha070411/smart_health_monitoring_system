package com.healthportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "emergency_alerts")
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private String location; // GPS coordinates or address

    @Enumerated(EnumType.STRING)
    private AlertStatus status; // ACTIVE, RESOLVED

    private LocalDateTime triggeredAt;

    public enum AlertStatus {
        ACTIVE, RESOLVED
    }
}
