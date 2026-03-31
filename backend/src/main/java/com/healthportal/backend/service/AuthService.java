package com.healthportal.backend.service;

import com.healthportal.backend.config.JwtTokenProvider;
import com.healthportal.backend.dto.AuthResponse;
import com.healthportal.backend.dto.LoginRequest;
import com.healthportal.backend.dto.RegisterRequest;
import com.healthportal.backend.entity.Doctor;
import com.healthportal.backend.entity.Patient;
import com.healthportal.backend.entity.User;
import com.healthportal.backend.repository.DoctorRepository;
import com.healthportal.backend.repository.PatientRepository;
import com.healthportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider tokenProvider;

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User.Role role = User.Role.valueOf(request.getRole().toUpperCase());
        user.setRole(role);
        
        User savedUser = userRepository.save(user);

        if (role == User.Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFirstName(request.getFirstName());
            patient.setLastName(request.getLastName());
            patientRepository.save(patient);
        } else if (role == User.Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setFirstName(request.getFirstName());
            doctor.setLastName(request.getLastName());
            doctor.setSpecialization(request.getSpecialization());
            doctorRepository.save(doctor);
        }
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        Long refId = null;

        if (user.getRole() == User.Role.PATIENT) {
            Optional<Patient> p = patientRepository.findByUserId(user.getId());
            if (p.isPresent()) refId = p.get().getId();
        } else if (user.getRole() == User.Role.DOCTOR) {
            Optional<Doctor> d = doctorRepository.findByUserId(user.getId());
            if (d.isPresent()) refId = d.get().getId();
        }

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getRole(), refId);
    }

    public User getMe(String username) {
        return userRepository.findByUsername(username).orElseThrow();
    }
}
