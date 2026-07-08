package com.carbontrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "emission_factors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionFactor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(nullable = false)
    private String unit;

    @Column(name = "kg_co2e_per_unit", nullable = false, precision = 10, scale = 4)
    private BigDecimal kgCo2ePerUnit;

    private String source;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;
}
