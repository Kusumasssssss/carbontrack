# Milestone 3: Leaderboard, Missing Pages & Dashboard Integration

This document outlines the implementation plan for **Milestone 3**, covering 5 work streams: LeaderboardController, 4 missing page files, missing routes, Dashboard widget integration, and the leaderboard feature.

---

## Work Stream 1: LeaderboardController (Backend)

### Objective
Create `LeaderboardController.java` with a `GET /api/leaderboard` endpoint that returns top users ranked by their total CO₂e reduction (or lowest footprint).

### Tasks
1. Create `LeaderboardController.java` at `src/main/java/com/carbontrack/controller/LeaderboardController.java`
   - Endpoint: `GET /api/leaderboard`
   - Query the `users` table joined with aggregated footprint data
   - Return a ranked list: `[{rank, userId, displayName, totalFootprint, reductionPercent, badgeCount}]`
   - Limit to top 10–20 users
   - Include the current user's rank if requested via query param `?userId=X`
2. Add a service method in a new or existing service layer to compute aggregation logic
3. Register the route (Spring Boot auto-detects via `@RestController`)

### Files to Create/Modify
- **Create:** `src/main/java/com/carbontrack/controller/LeaderboardController.java`
- **Create (if needed):** `src/main/java/com/carbontrack/service/LeaderboardService.java`

---

## Work Stream 2: Create 4 Missing Page Files (Frontend)

### Objective
Create four missing page components in `frontend/src/pages/`.

### 2a. Leaderboard.js
- Wrap around a new leaderboard display component or build inline
- Fetch from `GET /api/leaderboard` (to be created in Work Stream 1)
- Display a ranked table/card list with user name, footprint, badges
- Highlight the current user's row

### 2b. Benchmarking.js
- Integrate existing `components/PeerBenchmarking.js` component
- Add page layout, header, and navigation context
- Fetch data from existing `GET /api/benchmark` endpoints

### 2c. Profile.js
- Display user profile info (name, email, preferences, stats)
- Fetch from existing `GET /api/users/{id}` endpoint
- Show total footprint, badges earned, goals progress
- Allow preference updates via `PUT /api/users/{id}`

### 2d. Chatbot.js (Standalone Page)
- Wrap existing `components/Chatbot.js` in a full-page layout
- Add page header and styling consistent with other pages
- Chatbot component already handles Gemini AI integration

### Files to Create
- `frontend/src/pages/Leaderboard.js`
- `frontend/src/pages/Benchmarking.js`
- `frontend/src/pages/Profile.js`
- `frontend/src/pages/Chatbot.js`

---

## Work Stream 3: Add Missing Routes (Frontend)

### Objective
Add 4 missing routes in `frontend/src/App.js` so the new pages are accessible.

### Routes to Add
```jsx
<Route path="/leaderboard" element={<Leaderboard />} />
<Route path="/benchmarking" element={<Benchmarking />} />
<Route path="/profile" element={<Profile />} />
<Route path="/chatbot" element={<Chatbot />} />
```

### Sidebar/Navigation Update
- Add navigation links to the sidebar/nav component for the new routes
- Ensure the active route highlighting works for the new paths

### Files to Modify
- `frontend/src/App.js` – add routes
- `frontend/src/components/Sidebar.js` or equivalent nav component – add nav items

---

## Work Stream 4: Dashboard Widget Integration (Frontend)

### Objective
Integrate existing chart components into `pages/Dashboard.js` to show real data.

### Tasks
1. Import and use `CarbonPieChart.js` to show footprint breakdown by category
2. Import and use `CarbonTrendChart.js` to show weekly CO₂e trend
3. Import and use `ChartSection.js` or `GoalCard.js` for monthly progress
4. Wire up API calls to existing endpoints:
   - `GET /api/footprint/weekly-summary`
   - `GET /api/footprint/monthly-summary`
   - `GET /api/goals/progress`
5. Handle loading, empty, and error states for each widget

### Files to Modify
- `frontend/src/pages/Dashboard.js` – add imports and widget sections

---

## Work Stream 5: Leaderboard Feature (Frontend-Backend Integration)

### Objective
Complete the end-to-end leaderboard feature tying the new backend controller to the frontend page.

### Tasks
1. Ensure `LeaderboardController` returns data in the expected shape
2. In `Leaderboard.js`, call `GET /api/leaderboard?userId={currentUserId}` on mount
3. Display rank, name, footprint, badges, and reduction percentage
4. Add loading spinner and error state
5. Style consistently with the rest of the app (Tailwind utility classes)

---

## Implementation Order (Recommended)

| Step | Work Stream | Description |
|------|-------------|-------------|
| 1 | WS1 | Create LeaderboardController + Service |
| 2 | WS5 | Build Leaderboard.js frontend + wire to API |
| 3 | WS2b | Create Benchmarking.js page (uses existing API) |
| 4 | WS2c | Create Profile.js page (uses existing API) |
| 5 | WS2d | Create Chatbot.js page (wraps existing component) |
| 6 | WS3 | Add all 4 routes + nav links |
| 7 | WS4 | Integrate Dashboard widgets |
| 8 | WS2a | Revisit Leaderboard.js if Dashboard integration reveals API changes |

---

## Files Summary

### Files to Create (5)
| File | Stream |
|------|--------|
| `src/main/java/com/carbontrack/controller/LeaderboardController.java` | WS1 |
| `frontend/src/pages/Leaderboard.js` | WS5 |
| `frontend/src/pages/Benchmarking.js` | WS2b |
| `frontend/src/pages/Profile.js` | WS2c |
| `frontend/src/pages/Chatbot.js` | WS2d |

### Files to Modify (3)
| File | Stream |
|------|--------|
| `frontend/src/App.js` | WS3 |
| `frontend/src/components/Sidebar.js` (or nav component) | WS3 |
| `frontend/src/pages/Dashboard.js` | WS4 |

---

## Notes
- All backend endpoints for Benchmarking, Chatbot, Recommendations, Goals, Badges, Activities, Footprint already exist (verified during audit).
- `PeerBenchmarking.js` component already exists at `frontend/src/components/` and will be integrated into `Benchmarking.js`.
- `Chatbot.js` component already exists at `frontend/src/components/` and will be wrapped by the page.
- Existing Dashboard charts (`CarbonPieChart.js`, `CarbonTrendChart.js`, `ChartSection.js`) are ready for import.