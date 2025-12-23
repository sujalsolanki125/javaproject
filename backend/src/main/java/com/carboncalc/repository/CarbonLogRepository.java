package com.carboncalc.repository;

import com.carboncalc.entity.CarbonLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CarbonLogRepository extends JpaRepository<CarbonLog, Long> {
    List<CarbonLog> findByUserId(Long userId);

    List<CarbonLog> findByUserIdAndLogDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(c.carbonEmission) FROM CarbonLog c WHERE c.user.id = ?1")
    Double getTotalCarbonByUserId(Long userId);
}
