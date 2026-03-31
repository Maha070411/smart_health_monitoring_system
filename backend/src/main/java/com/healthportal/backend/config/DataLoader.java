package com.healthportal.backend.config;

import com.healthportal.backend.entity.Doctor;
import com.healthportal.backend.entity.Patient;
import com.healthportal.backend.entity.User;
import com.healthportal.backend.repository.DoctorRepository;
import com.healthportal.backend.repository.PatientRepository;
import com.healthportal.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      PatientRepository patientRepository,
                      DoctorRepository doctorRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (userRepository.count() > 0) return;

        // ===== Create Patient User =====
        User patientUser = new User();
        patientUser.setUsername("patient1");
        patientUser.setEmail("patient1@healthportal.com");
        patientUser.setPassword(passwordEncoder.encode("patient123"));
        patientUser.setRole(User.Role.PATIENT);
        patientUser = userRepository.save(patientUser);

        Patient patient = new Patient();
        patient.setUser(patientUser);
        patient.setFirstName("Rahul");
        patient.setLastName("Sharma");
        patient.setPhone("9876543210");
        patient.setAddress("123, MG Road, Bengaluru");
        patient.setDob("1995-06-15");
        patientRepository.save(patient);

        // ===== Create Doctor User =====
        User doctorUser = new User();
        doctorUser.setUsername("doctor1");
        doctorUser.setEmail("doctor1@healthportal.com");
        doctorUser.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser.setRole(User.Role.DOCTOR);
        doctorUser = userRepository.save(doctorUser);

        Doctor doctor = new Doctor();
        doctor.setUser(doctorUser);
        doctor.setFirstName("Priya");
        doctor.setLastName("Patel");
        doctor.setSpecialization("Cardiologist");
        doctor.setExperienceYears(10);
        doctorRepository.save(doctor);

        // ===== Create a second Doctor =====
        User doctorUser2 = new User();
        doctorUser2.setUsername("doctor2");
        doctorUser2.setEmail("doctor2@healthportal.com");
        doctorUser2.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser2.setRole(User.Role.DOCTOR);
        doctorUser2 = userRepository.save(doctorUser2);

        Doctor doctor2 = new Doctor();
        doctor2.setUser(doctorUser2);
        doctor2.setFirstName("Amit");
        doctor2.setLastName("Verma");
        doctor2.setSpecialization("Neurologist");
        doctor2.setExperienceYears(8);
        doctorRepository.save(doctor2);

        System.out.println("==============================================");
        System.out.println("  DATABASE SEEDED WITH SAMPLE DATA");
        System.out.println("==============================================");
        System.out.println("  PATIENT LOGIN:");
        System.out.println("    Username: patient1");
        System.out.println("    Email:    patient1@healthportal.com");
        System.out.println("    Password: patient123");
        System.out.println("----------------------------------------------");
        System.out.println("  DOCTOR LOGIN:");
        System.out.println("    Username: doctor1");
        System.out.println("    Email:    doctor1@healthportal.com");
        System.out.println("    Password: doctor123");
        System.out.println("----------------------------------------------");
        System.out.println("  DOCTOR 2 LOGIN:");
        System.out.println("    Username: doctor2");
        System.out.println("    Email:    doctor2@healthportal.com");
        System.out.println("    Password: doctor123");
        System.out.println("==============================================");
    }
}
