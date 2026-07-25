package com.carbontrack.repository;

import com.carbontrack.entity.ActivityLog;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUser(User user);

    @org.springframework.data.jpa.repository.Query("SELECT new com.carbontrack.dto.CategoryAggregation(a.category, SUM(a.carbonEmission)) " +
            "FROM ActivityLog a WHERE a.user = :user AND a.date >= :startDate AND a.date <= :endDate " +
            "GROUP BY a.category")
    List<com.carbontrack.dto.CategoryAggregation> findAggregatedFootprints(
            @org.springframework.data.repository.query.Param("user") User user, 
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, 
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);
    List<ActivityLog> findTop3ByUserAndDateAfterOrderByCarbonEmissionDesc(User user, java.time.LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.date FROM ActivityLog a WHERE a.user = :user ORDER BY a.date DESC")
    List<java.time.LocalDate> findDistinctDatesByUserOrderByDateDesc(@org.springframework.data.repository.query.Param("user") User user);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(a.carbonEmission) FROM ActivityLog a WHERE a.user = :user")
    Double findTotalCarbonEmissionByUser(@org.springframework.data.repository.query.Param("user") User user);

    @org.springframework.data.jpa.repository.Query("SELECT new com.carbontrack.dto.CategoryAggregation(a.category, AVG(a.carbonEmission)) FROM ActivityLog a GROUP BY a.category")
    List<com.carbontrack.dto.CategoryAggregation> findPlatformCategoryAverages();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(a.carbonEmission) FROM ActivityLog a GROUP BY a.user.id")
    List<Double> findTotalCarbonEmissionsPerUser();
}