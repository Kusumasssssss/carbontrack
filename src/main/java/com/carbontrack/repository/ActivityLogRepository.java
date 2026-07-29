package com.carbontrack.repository;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // ==========================
    // Get All Activities
    // ==========================
    List<ActivityLog> findByUser(User user);

    // ==========================
    // Carbon Breakdown
    // ==========================
    @Query("""
           SELECT new com.carbontrack.dto.CategoryAggregation(
               a.category,
               SUM(a.carbonEmission)
           )
           FROM ActivityLog a
           WHERE a.user = :user
           AND a.date >= :startDate
           AND a.date <= :endDate
           GROUP BY a.category
           """)
    List<CategoryAggregation> findAggregatedFootprints(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ==========================
    // Top 3 Highest Emissions
    // ==========================
    List<ActivityLog> findTop3ByUserAndDateAfterOrderByCarbonEmissionDesc(
            User user,
            LocalDate date
    );

    // ==========================
    // Total Carbon Emission
    // ==========================
    @Query("""
           SELECT COALESCE(SUM(a.carbonEmission), 0)
           FROM ActivityLog a
           WHERE a.user = :user
           AND a.date BETWEEN :startDate AND :endDate
           """)
    Double getTotalCarbonEmission(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ==========================
    // Count Active Days
    // ==========================
    @Query("""
           SELECT COUNT(DISTINCT a.date)
           FROM ActivityLog a
           WHERE a.user = :user
           AND a.date >= :startDate
           """)
    Long countActiveDays(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate
    );

    // ==========================
    // Distinct Activity Dates
    // ==========================
    @Query("SELECT DISTINCT a.date FROM ActivityLog a WHERE a.user = :user ORDER BY a.date DESC")
    List<LocalDate> findDistinctDatesByUserOrderByDateDesc(@Param("user") User user);

    // ==========================
    // Total Carbon Emission By User
    // ==========================
    @Query("SELECT COALESCE(SUM(a.carbonEmission), 0.0) FROM ActivityLog a WHERE a.user = :user")
    Double findTotalCarbonEmissionByUser(@Param("user") User user);

    // ==========================
    // Total Carbon Emissions Per User (List of all totals)
    // ==========================
    @Query("SELECT COALESCE(SUM(a.carbonEmission), 0.0) FROM ActivityLog a GROUP BY a.user")
    List<Double> findTotalCarbonEmissionsPerUser();

    // ==========================
    // Platform Category Averages
    // ==========================
    @Query("""
           SELECT new com.carbontrack.dto.CategoryAggregation(
               a.category,
               AVG(a.carbonEmission)
           )
           FROM ActivityLog a
           GROUP BY a.category
           """)
    List<CategoryAggregation> findPlatformCategoryAverages();

}