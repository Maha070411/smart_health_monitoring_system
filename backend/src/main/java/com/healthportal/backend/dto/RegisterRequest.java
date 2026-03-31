package com.healthportal.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // PATIENT, DOCTOR
    // Patient details
    private String firstName;
    private String lastName;
    // Doctor specific
    private String specialization;
}
