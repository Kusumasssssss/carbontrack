-- Seed data for user_id = 3 to test the Redis caching aggregation endpoints

-- Activities for TODAY
INSERT INTO activity_logs (user_id, category, activity_type, quantity, unit, co2e_kg, log_date) 
VALUES (3, 'TRANSPORT', 'DRIVING_CAR', 20.0, 'KM', 4.5000, CURDATE());

INSERT INTO activity_logs (user_id, category, activity_type, quantity, unit, co2e_kg, log_date) 
VALUES (3, 'ELECTRICITY', 'HOME_USAGE', 15.0, 'KWH', 6.2000, CURDATE());

-- Activity for EARLIER THIS WEEK (2 days ago)
INSERT INTO activity_logs (user_id, category, activity_type, quantity, unit, co2e_kg, log_date) 
VALUES (3, 'FOOD', 'MEAT_MEAL', 1.0, 'MEAL', 3.0000, DATE_SUB(CURDATE(), INTERVAL 2 DAY));

-- Activity for EARLIER THIS MONTH (10 days ago)
INSERT INTO activity_logs (user_id, category, activity_type, quantity, unit, co2e_kg, log_date) 
VALUES (3, 'TRANSPORT', 'FLIGHT_SHORT', 1.0, 'FLIGHT', 150.0000, DATE_SUB(CURDATE(), INTERVAL 10 DAY));

-- Activity for EARLIER THIS MONTH (15 days ago)
INSERT INTO activity_logs (user_id, category, activity_type, quantity, unit, co2e_kg, log_date) 
VALUES (3, 'SHOPPING', 'CLOTHES', 2.0, 'ITEM', 12.0000, DATE_SUB(CURDATE(), INTERVAL 15 DAY));
