package com.carbontrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Badge Name
    @Column(nullable = false)
    private String name;

    // Badge Description
    private String description;

    // STREAK, GOAL, REDUCTION
    @Column(name = "trigger_type", nullable = false)
    private String triggerType;

    // Example:
    // STREAK -> 7
    // REDUCTION -> 10,25,50
    @Column(nullable = false)
    private Integer threshold;

    // User who earned the badge
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Date badge earned
    private LocalDate earnedDate;

    // Badge status
    @Builder.Default
    private Boolean earned = false;
}