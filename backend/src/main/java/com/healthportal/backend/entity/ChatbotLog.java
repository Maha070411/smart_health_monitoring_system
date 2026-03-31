package com.healthportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chatbot_logs")
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(length = 1000)
    private String question;
    
    @Column(length = 2000)
    private String answer;

    private LocalDateTime askTime;
}
