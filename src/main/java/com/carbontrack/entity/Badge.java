package com.carbontrack.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "trigger_type", nullable = false)
    private String triggerType; // STREAK, GOAL, REDUCTION

    @Column(nullable = false)
    private Integer threshold;
}
