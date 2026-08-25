-- Seed data for emission_factors

INSERT INTO emission_factors (activity_type, unit, kg_co2e_per_unit, source, effective_date) 
VALUES ('Driving', 'km', 0.22, 'EPA Standard', CURDATE());

INSERT INTO emission_factors (activity_type, unit, kg_co2e_per_unit, source, effective_date) 
VALUES ('Flight', 'km', 0.15, 'EPA Standard', CURDATE());

INSERT INTO emission_factors (activity_type, unit, kg_co2e_per_unit, source, effective_date) 
VALUES ('Electricity', 'kWh', 0.45, 'EPA Standard', CURDATE());

INSERT INTO emission_factors (activity_type, unit, kg_co2e_per_unit, source, effective_date) 
VALUES ('Meat Meal', 'kg', 3.30, 'EPA Standard', CURDATE());
