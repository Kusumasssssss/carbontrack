**1\. Project Title:**

**Web Platform for Environmental Impact Tracking and Sustainability Analytics (CarbonTrack)**

# 2\. Project Statement and Outcomes

Most individuals have no reliable way to quantify their daily environmental impact - the carbon emitted by their commutes, electricity consumption, diet choices, and consumer purchases adds up invisibly. Without a structured tracking tool that converts everyday behaviours into measurable CO₂ equivalents, personal sustainability goals remain vague and unactionable. This project builds a full-stack Java carbon footprint tracking platform - "CarbonTrack" - using Spring Boot and React.js where users log daily activities across transport, electricity, food, and shopping categories.

The backend applies configurable rule-based emission formulas (kg CO₂e per unit) sourced from IPCC and EPA datasets, calculates weekly and monthly footprint totals by category, generates personalised reduction recommendations based on the highest-impact activities, and supports user-defined sustainability goals with milestone tracking.

The deliverable is a complete personal carbon tracking web application with a Spring Boot REST API backend and an interactive React.js sustainability dashboard. Users log activities, view real-time CO₂ calculations, track progress against personal reduction goals, and receive tailored weekly insights. The dashboard presents rich visualisations: category-wise footprint breakdown (Recharts pie chart), weekly trend line chart, month-over-month comparison, and a peer benchmarking view. A community leaderboard rewards consistent low-footprint users with badges and rankings. Businesses or institutions can access an organisational dashboard aggregating employee footprints for corporate sustainability reporting.

**_Teaching note:_** _CarbonTrack is an excellent teaching project because every feature maps directly to a transferable engineering pattern: emission formulas → rule engines; aggregation queries → JPQL/SQL grouping and caching; recommendations → data-driven business logic; leaderboards → ranked social features. Use it to show students how the same Spring Boot + React stack can be applied to a real-world sustainability domain that many companies are actively building tools for._

# 3\. Modules to be Implemented

- User Profiles, Activity Logging Schema & Emission Calculation Engine
- Analytics Engine, Reduction Recommendations & Goal Tracking
- React.js Sustainability Dashboard, Charts & Community Leaderboard
- System Integration, Testing & Project Finalization

# 4\. Milestone-wise Module Implementation and High-Level Requirements

Each milestone below lists the objectives, the concrete features to build, the core engineering concepts you should explain to students as you go, and the deliverables that mark the milestone complete.

## Milestone 1: User Profiles, Activity Logging Schema & Emission Calculation Engine

**Objectives**

- Design the data model that every calculation, chart, and recommendation depends on.
- Secure the platform with JWT (and optional OAuth2) authentication before business logic is built.
- Build the core emission calculation engine - the heart of the product.

**Features to Implement**

**Database & Schema**

- Design a PostgreSQL schema for users, activity_logs (category, activity_type, quantity, unit, log_date), emission_factors (configurable kg CO₂e per unit per activity type), goals, and badges.
- Map all tables to JPA entities with Flyway migration scripts for versioned schema evolution.

**Authentication & User Profiles**

- Implement Spring Security 6 JWT authentication with optional Google OAuth2 login for quick onboarding.
- Build a user profile management API with sustainability preference settings (e.g. preferred units, goal visibility).

**Activity Logging APIs**

- Build REST APIs for four activity categories: transport (car km, flights, public transit), electricity (kWh consumed, energy source), food (meal type, servings), and shopping (product category, spend amount).
- Apply Jakarta Bean Validation on all incoming activity payloads to reject malformed or out-of-range entries.

**Emission Calculation Engine**

- For each logged activity, look up the configured emission factor for that activity type and unit, multiply by quantity, and store the resulting kg CO₂e value alongside the log entry.
- Store emission_factors in the database (not hardcoded) so admins can update them as IPCC/EPA tables are revised.

**Testing**

- Write JUnit 5 unit tests for emission calculations across all categories with boundary cases: zero quantity, maximum values, and unknown activity types.
- Use parameterised tests to verify emission factor correctness across a table of inputs and expected outputs.

**Concepts to Explain to Students**

- **Rule engine pattern:** explain how storing emission factors in the database (rather than hardcoding them) makes the system configurable and updatable without a code deployment.
- **OAuth2 vs JWT:** contrast password-based JWT login with Google OAuth2 - same security outcome, very different user experience and implementation path.
- **Parameterised tests:** show how @ParameterizedTest with @CsvSource can verify a calculation engine against a table of known inputs and expected CO₂e values in a few lines.
- **Database-driven configuration:** discuss why domain constants (like emission factors) belong in the database, not in application.properties or code enums.

**Deliverables**

- Working PostgreSQL schema with Flyway migrations for all entities.
- JWT + optional Google OAuth2 authentication with user profile management.
- Activity logging APIs for all four categories with validation.
- A configurable emission calculation engine that persists a kg CO₂e value per log entry.
- A JUnit 5 test suite with boundary and parameterised emission tests.

## Milestone 2: Analytics Engine, Reduction Recommendations & Goal Tracking

**Objectives**

- Turn individual log entries into meaningful daily/weekly/monthly footprint summaries.
- Give users personalised, data-driven advice - not generic tips.
- Keep users motivated with progress tracking, peer comparison, and achievement badges.

**Features to Implement**

**Footprint Aggregation Engine**

- Build daily, weekly, and monthly footprint aggregation using JPA JPQL aggregate queries grouped by category and date range.
- Cache aggregation results in Redis to achieve sub-100 ms dashboard load times, invalidating cache entries when new activity logs are saved.

**Personalised Recommendation Engine**

- Analyse the user's top 3 highest-emission activities over the last 30 days.
- Map each high-emission activity type to a set of specific, actionable reduction tips and return them as the user's personalised weekly insights.

**Goal Management System**

- Let users set a target footprint reduction percentage over a configurable time period.
- Calculate weekly progress, project whether the goal is on-track based on recent trend, and send encouragement or correction alerts when the trajectory changes.

**Peer Benchmarking Module**

- Calculate anonymous platform-wide averages per category.
- Present each user's relative standing (percentile) against the user base to motivate improvement without exposing individual data.

**Badge & Achievement Engine**

- Use Spring application events to award badges for milestones: 7-day logging streak, first goal achieved, and CO₂e reduction of 10/25/50 kg.
- Persist earned badges to the user's profile for display on the dashboard and leaderboard.

**Concepts to Explain to Students**

- **JPQL aggregate queries:** show how GROUP BY category and SUM(co2e) in JPQL map to SQL and how to wrap them in a Spring Data repository using @Query.
- **Redis caching:** introduce @Cacheable and cache invalidation - explain why caching aggregation queries (expensive, rarely changing) but not raw logs (written frequently) is the right trade-off.
- **Data-driven recommendations:** discuss the difference between hardcoded tips (fragile, not personalised) and tips mapped from a user's own top-emission activities (adaptive and relevant).
- **Spring events for badges:** use the badge engine to introduce the Observer pattern - the logging service publishes an ActivityLoggedEvent; the badge service listens and awards badges without tight coupling.
- **Percentile ranking:** walk through how to compute a user's percentile using a simple JPQL count query before building anything more complex.

**Deliverables**

- A JPQL-based footprint aggregation engine with Redis caching for daily, weekly, and monthly views.
- A personalised recommendation engine mapping top-emission activities to actionable tips.
- A goal management system with progress tracking, on-track projection, and automated alerts.
- An anonymous peer benchmarking module showing each user's percentile ranking.
- A Spring-events-based badge engine persisting achievement milestones to user profiles.

## Milestone 3: React.js Sustainability Dashboard, Charts & Community Leaderboard

**Objectives**

- Give users a rich, interactive view of their footprint that makes data meaningful at a glance.
- Build social motivation through leaderboards and peer habits.
- Serve organisations with a team-level sustainability reporting view.

**Features to Implement**

**Activity Logging Interface**

- Build a React.js logging interface with category tabs, activity type dropdowns, quantity inputs with unit labels, and a quick-log carousel for frequently logged activities.
- Show a real-time CO₂e preview as the user fills in quantity, using the emission factor fetched from the backend.

**Personal Sustainability Dashboard**

- Build a today's footprint summary card, a Recharts category breakdown pie chart, and a weekly trend line chart comparing the current week to the previous week.
- Add a monthly cumulative progress bar showing total CO₂e vs. the user's monthly target.

**Goal Tracking Widget**

- Show the user's current footprint vs. their goal target with a progress indicator.
- Display daily reduction required to stay on track and a timeline chart projecting future footprint based on the recent trend.

**Community Leaderboard**

- Display the top 50 lowest-footprint users (anonymised by username) with their badge collection and category strengths.
- Add a 'follow their habits' tips section on each leaderboard entry showing what that user does differently.

**Organisational Dashboard**

- Aggregate footprints for all users in a registered organisation, showing team-wide emissions by category and month-over-month trends.
- Include a per-employee comparison table suitable for corporate sustainability (CSR) reporting exports.

**Concepts to Explain to Students**

- **Recharts for time-series data:** show how to map an array of daily footprint objects to a LineChart with a date X-axis and CO₂e Y-axis, handling missing days gracefully.
- **Real-time preview UX:** demonstrate how to compute the emission preview on the client (emission factor × quantity) to give instant feedback without a round-trip API call.
- **Anonymous leaderboard design:** discuss how to display competitive rankings without exposing personal data - a useful privacy design pattern for any social feature.
- **Multi-tenant organisational view:** introduce the concept of scoping queries by organisation ID to support multiple companies on one platform without data leakage.

**Deliverables**

- A React activity logging interface with real-time CO₂e preview.
- A personal dashboard with pie chart, weekly trend line, and monthly progress bar.
- A goal tracking widget with on-track projection and daily target indicator.
- A community leaderboard with badges, category strengths, and habit tips.
- An organisational dashboard with team emissions, trends, and per-employee comparison table.

## Milestone 4: System Integration, Testing & Project Finalization

**Objectives**

- Prove the whole pipeline works end to end under realistic conditions.
- Polish the experience based on real feedback.
- Document and present the system as a complete, professional deliverable.

**Features to Implement**

**End-to-End Integration**

- Test the full chain: activity logging → emission calculation → analytics aggregation → recommendation engine → React dashboard → leaderboard.
- Resolve any cross-module compatibility issues and edge-case failures discovered during integration.

**Performance & Cross-Browser Testing**

- Load- and stress-test the Spring Boot REST APIs with Apache JMeter or k6.
- Validate the UI on Chrome, Firefox and Edge, and address performance bottlenecks found during peer/mentor review.

**UX Refinement**

- Improve interface clarity, add contextual help and input validation.
- Ensure full responsiveness on mobile and tablet, and polish transitions and error states across all React components.

**Documentation**

- Document system architecture and entity-relationship diagrams.
- Generate an API reference with Swagger/OpenAPI via springdoc-openapi.
- Write a deployment guide using Docker Compose, list the Flyway migration scripts, and record known limitations.

**Final Presentation**

- Prepare a final PPT covering problem statement, proposed solution, architecture, key features, technology stack, results, challenges, and future scope.
- Rehearse a full end-to-end demo so the delivery is smooth and confident.

**Concepts to Explain to Students**

- **Load testing:** explain the difference between functional tests (does it work?) and load tests (does it still work under concurrent users?).
- **API documentation:** show how OpenAPI/Swagger specs double as both documentation and a live contract for the frontend team.

**Deliverables**

- A fully integrated, end-to-end tested platform.
- Load/stress test results and cross-browser validation sign-off.
- A polished, responsive UI with refined error and loading states.
- Complete documentation: architecture, ER diagrams, API reference, deployment guide.
- A rehearsed final presentation and live demo.

# 5\. System Flow

The supplied flow chart traces a single activity entry end to end: the user logs an activity via the React form → an HTTP POST is sent → the API verifies the JWT → the Emission Calculation Service computes kg CO₂e → the entry is persisted to PostgreSQL → daily and monthly stats are aggregated → the system checks whether the user's goal threshold has been breached → if so, an alert and eco tip are generated → the Recharts dashboard is refreshed. Walking students through this diagram before coding sets shared vocabulary and shows how the modules chain together.

# 6\. Sample Dashboard Reference

The supplied "CarbonTrack" dashboard mock-up shows the target admin/overview screen for Milestone 3: headline stats (active users, average daily CO₂, goals achieved, CO₂ saved), an average emissions by category bar chart, a goal-progress panel with per-user on-track/missed/in-progress status, and a recent activity logs table with per-row CO₂e values and goal alignment flags. Use it as the visual target when building the personal sustainability dashboard and organisational view.

# 7\. Recommended Technology Stack

| **Layer**          | **Technology**                       | **Purpose**                                            |
| ------------------ | ------------------------------------ | ------------------------------------------------------ |
| Backend Framework  | Spring Boot 3 (Java 17)              | REST APIs, dependency injection, application structure |
| Security           | Spring Security 6 + JWT + OAuth2     | Authentication, role-based access, Google login        |
| Database           | PostgreSQL + Flyway                  | Persistent storage and versioned schema migrations     |
| ORM                | Spring Data JPA / Hibernate          | Entity mapping, JPQL aggregate queries                 |
| Caching            | Redis + Spring Cache (@Cacheable)    | Sub-100 ms aggregation results for dashboard load      |
| Event System       | Spring Application Events            | Decoupled badge and achievement engine                 |
| Frontend Framework | React.js                             | Component-based single-page application                |
| Charts             | Recharts                             | Pie chart, line chart, bar chart, progress bars        |
| API Docs           | springdoc-openapi (Swagger)          | Auto-generated, browsable API reference                |
| Testing            | JUnit 5, Mockito, Apache JMeter / k6 | Unit, integration and load/stress testing              |
| Deployment         | Docker Compose                       | Reproducible multi-container local/staging deployment  |

# 8\. Core Database Entities

| **Entity**       | **Key Fields**                                                          | **Notes**                                              |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| users            | id, username, email, password_hash, role, org_id                        | role is enum: USER / ADMIN / ORG_ADMIN                 |
| activity_logs    | id, user_id, category, activity_type, quantity, unit, co2e_kg, log_date | co2e_kg computed at insert time by the emission engine |
| emission_factors | id, activity_type, unit, kg_co2e_per_unit, source, effective_date       | DB-stored; updateable without code changes             |
| goals            | id, user_id, target_reduction_pct, period_days, start_date, status      | status is enum: ACTIVE / ACHIEVED / MISSED             |
| badges           | id, name, description, trigger_type, threshold                          | trigger_type: STREAK / GOAL / REDUCTION                |
| user_badges      | id, user_id, badge_id, awarded_at                                       | Join table: a user's earned achievements               |
| organisations    | id, name, admin_user_id                                                 | Groups users for the corporate dashboard               |

# 9\. Learning Outcomes for Students

- Designing a configurable rule engine backed by a database (emission factors) rather than hardcoded constants.
- Writing parameterised JUnit tests to verify a calculation engine against a table of known input/output pairs.
- Building JPQL aggregate queries (GROUP BY, SUM, AVG) and caching their results with Redis to meet performance targets.
- Implementing the Observer pattern in Spring (application events) to decouple a badge/achievement engine from core business logic.
- Turning raw analytics data into rich, interactive Recharts visualisations: pie charts, line charts, progress bars, and trend comparisons.
- Designing anonymous leaderboards and peer benchmarking features that motivate users without exposing personal data.
- Supporting multi-tenancy (organisations) by scoping all queries to a tenant ID, a pattern used in virtually every SaaS product.
- Load testing and tuning a REST API, and documenting it for other engineers via OpenAPI/Swagger.