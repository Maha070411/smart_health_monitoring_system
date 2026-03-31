package com.healthportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "health_data")
@NoArgsConstructor
@AllArgsConstructor
public class HealthData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private String bloodPressure;
    private Integer heartRate;
    private Double temperature;

    private LocalDateTime recordedAt;
}
