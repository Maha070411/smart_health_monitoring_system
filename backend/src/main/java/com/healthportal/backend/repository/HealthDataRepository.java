package com.healthportal.backend.repository;

import com.healthportal.backend.entity.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByPatientIdOrderByRecordedAtDesc(Long patientId);
}
