package com.carbontrack.service;

import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.repository.EmissionFactorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmissionCalculationTest {

    @Mock
    private EmissionFactorRepository emissionFactorRepository;

    @InjectMocks
    private ActivityLogService activityLogService;

    @BeforeEach
    public void setup() {
        // Mock responses are configured in each test
    }

    @ParameterizedTest
    @CsvSource({
            "Car, 10.0, 0.21, 2.1",
            "Flight, 500.0, 0.15, 75.0",
            "Bus, 20.0, 0.08, 1.6",
            "Electricity, 100.0, 0.82, 82.0"
    })
    public void testCalculateCarbonEmission_ValidInputs(
            String activityType,
            double quantity,
            double factorValue,
            double expectedEmission) {

        EmissionFactor factor = new EmissionFactor();
        factor.setActivityType(activityType);
        factor.setKgCo2ePerUnit(BigDecimal.valueOf(factorValue));

        when(emissionFactorRepository.findByActivityTypeIgnoreCase(activityType))
                .thenReturn(Optional.of(factor));

        double result = activityLogService.calculateCarbonEmission(activityType, quantity);

        assertEquals(expectedEmission, result, 0.001);
    }

    @Test
    public void testCalculateCarbonEmission_ZeroQuantity() {

        EmissionFactor factor = new EmissionFactor();
        factor.setActivityType("Car");
        factor.setKgCo2ePerUnit(BigDecimal.valueOf(0.21));

        when(emissionFactorRepository.findByActivityTypeIgnoreCase("Car"))
                .thenReturn(Optional.of(factor));

        double result = activityLogService.calculateCarbonEmission("Car", 0.0);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateCarbonEmission_NullQuantity() {

        double result = activityLogService.calculateCarbonEmission("Car", null);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateCarbonEmission_UnknownActivityType() {

        when(emissionFactorRepository.findByActivityTypeIgnoreCase("Unknown"))
                .thenReturn(Optional.empty());

        double result = activityLogService.calculateCarbonEmission("Unknown", 100.0);

        assertEquals(0.0, result, 0.001);
    }
}