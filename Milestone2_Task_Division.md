# Milestone 2: Task Division (Ansh & Kusuma)

This document outlines the division of work for **Milestone 2: Analytics Engine, Reduction Recommendations & Goal Tracking**. The workload has been divided to ensure both team members can work in parallel on distinct modules without significant overlap, while integrating effectively.

## Ansh's Responsibilities

### 1. Footprint Aggregation Engine (Data Aggregation & Caching)
- **Objective:** Turn individual logs into daily, weekly, and monthly summaries.
- **Tasks:**
  - Write JPQL aggregate queries (e.g., `GROUP BY` category, `SUM(co2e)`) to fetch footprints for specific date ranges.
  - Implement Redis caching (`@Cacheable`) to ensure the dashboard loads in sub-100 ms.
  - Implement cache invalidation logic so that when a new activity is logged, the cached aggregations are cleared or updated.

### 2. Personalised Recommendation Engine (AI Integration)
- **Objective:** Provide smart, data-driven tips using AI.
- **Tasks:**
  - Build the logic to analyze and extract a user's top 3 highest-emission activities over the last 30 days.
  - **Gemini API Integration:** Set up the Gemini API client. Write prompts to send the user's top activities to Gemini and receive specific, actionable, and personalized reduction recommendations.
  - Expose a REST API endpoint that the frontend can call to get these AI-generated insights.

---

## Kusuma's Responsibilities

### 1. Badge & Achievement Engine (Event-Driven Architecture)
- **Objective:** Keep users motivated by rewarding them for positive behaviors.
- **Tasks:**
  - Implement the **Observer pattern** using Spring Application Events.
  - Create the event publisher (e.g., triggered after an activity is logged or a goal is met).
  - Create event listeners to evaluate rules and award badges for:
    - 7-day continuous logging streak.
    - Achieving the first goal.
    - CO₂e reductions of 10kg, 25kg, and 50kg.
  - Persist earned badges to the user's profile.

### 2. Goal Management System
- **Objective:** Allow users to set footprint reduction targets and track progress.
- **Tasks:**
  - Build APIs for users to set a target footprint reduction percentage over a specific period.
  - Implement the logic to calculate weekly progress toward the goal.
  - Project whether the user is on-track based on their recent trend.
  - Implement system alerts/notifications (encouragement or correction) when the user's trajectory changes.

### 3. Peer Benchmarking Module
- **Objective:** Show relative standing against the community without exposing raw data.
- **Tasks:**
  - Write aggregate queries to calculate anonymous platform-wide averages per category.
  - Compute a user's relative standing (percentile ranking) against the rest of the user base using JPQL count queries.
  - Expose these statistics via an API endpoint for the dashboard.

---

## Shared / Collaborative Tasks

- **Integration & Testing:** Ensure Ansh's aggregation engine works smoothly with Kusuma's benchmarking module.
- **Code Review:** Review each other's pull requests, particularly focusing on the Gemini API integration and the Spring Events architecture.
- **API Documentation:** Update Swagger/OpenAPI documentation for all new endpoints introduced in this milestone.
