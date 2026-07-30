package com.carbontrack.repository;

import com.carbontrack.dto.CategoryAggregation;
import com.carbontrack.dto.UserLeaderboardEntry;
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
    // User Activity Logs
    // ==========================
    List<ActivityLog> findByUser(User user);

    // ==========================
    // Category-wise Footprint
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
            SELECT COALESCE(SUM(a.carbonEmission),0)
            FROM ActivityLog a
            WHERE a.user=:user
            AND a.date BETWEEN :startDate AND :endDate
            """)
    Double getTotalCarbonEmission(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ==========================
    // Distinct Activity Dates
    // ==========================
    @Query("""
            SELECT DISTINCT a.date
            FROM ActivityLog a
            WHERE a.user=:user
            ORDER BY a.date DESC
            """)
    List<LocalDate> findDistinctDatesByUserOrderByDateDesc(
            @Param("user") User user
    );

    // ==========================
    // Total User Emission
    // ==========================
    @Query("""
            SELECT COALESCE(SUM(a.carbonEmission),0)
            FROM ActivityLog a
            WHERE a.user=:user
            """)
    Double findTotalCarbonEmissionByUser(
            @Param("user") User user
    );

    // ==========================
    // Total Emissions Per User
    // ==========================
    @Query("""
            SELECT COALESCE(SUM(a.carbonEmission),0)
            FROM ActivityLog a
            GROUP BY a.user
            """)
    List<Double> findTotalCarbonEmissionsPerUser();

    // ==========================
    // Platform Category Average
    // ==========================
    @Query("""
            SELECT new com.carbontrack.dto.CategoryAggregation(
                a.category,
                COALESCE(AVG(a.carbonEmission),0)
            )
            FROM ActivityLog a
            GROUP BY a.category
            """)
    List<CategoryAggregation> findPlatformCategoryAverages();

    // ==========================
    // Leaderboard
    // ==========================
    @Query("""
            SELECT new com.carbontrack.dto.UserLeaderboardEntry(
                u.id,
                u.username,
                COALESCE(SUM(a.carbonEmission),0)
            )
            FROM ActivityLog a
            RIGHT JOIN a.user u
            GROUP BY u.id,u.username
            ORDER BY COALESCE(SUM(a.carbonEmission),0) ASC
            """)
    List<UserLeaderboardEntry> findLeaderboardEntries();

    // ==========================
    // 7-Day Activity Streak
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

}