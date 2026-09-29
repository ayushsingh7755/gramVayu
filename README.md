# GramVayu — Full-Stack MERN Prototype for Panchayat-Level Weather Forecast Downscaling & Agro-Meteorological Advisory System

## 1. Project Overview

**GramVayu** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) prototype built for the Smart India Hackathon problem statement on **Block-to-Panchayat Weather Forecast Downscaling**. It provides Gram Panchayat-level micro-meteorological forecasts, Block vs. Panchayat comparison analytics, an automated rule-based weather risk engine, an interactive GIS risk map, and crop-specific agro-meteorological advisories across three user roles (**Farmer**, **Agriculture Officer**, and **System Admin**).

> **Prototype Disclaimer:**  
> *"Panchayat-level forecasts shown in this prototype are simulated downscaled outputs. AI/ML-based operational downscaling will be integrated in a future version."*

---

## 2. Problem Statement

> **Downscaling of weather forecast from Block level to Panchayat level:** Inferring high-resolution plots/data/information from low-resolution plots/data/information/variables for agro-meteorological advisory services.

---

## 3. Key Features

- **4-Tier Geographic Hierarchy**: State → District → Block → Gram Panchayat (with latitude, longitude, elevation, area, population, and vegetation canopy factor).
- **Deterministic Prototype Downscaling Service (`downscalingService.js`)**: Computes repeatable, high-resolution Panchayat weather forecasts from Block-level weather bulletins using elevation lapse rates, vegetation evaporative cooling/moisture retention, and spatial coordinate gradients.
- **Pluggable AI/ML Architecture (`generatePanchayatForecast()`)**: Designed so a Python/FastAPI ML model can replace the prototype service without modifying Express controllers or the React frontend.
- **Rule-Based Weather Risk Engine (`riskService.js`)**: Evaluates rainfall (>50 mm heavy rain, >80 mm flood risk), temperature (>40°C heat stress, <5°C cold stress), and wind speed (>40 km/h lodging risk).
- **Interactive GIS Weather Map**: Built with Leaflet & React-Leaflet, displaying sample Block GeoJSON boundaries and risk-colored Panchayat markers (`Green`, `Yellow`, `Orange`, `Red`) with detailed popups.
- **Block vs. Panchayat Comparison (`/compare`)**: Side-by-side tabular and Recharts visual comparison of Block baseline vs. simulated Panchayat downscaled forecasts.
- **Agro-Meteorological Advisory System (`/advisories`)**: Crop-specific advisories (`irrigation`, `sowing`, `harvesting`, `pest_management`, `fertilizer`, `crop_protection`, `weather_alert`, `general`) with Cloudinary attachment support.
- **Role-Based Access Control (RBAC)**: JWT + HTTP-only cookies + `bcrypt` authentication supporting `farmer`, `officer`, and `admin` roles.

---

## 4. System Architecture

```text
                     ┌──────────────────────┐
                     │      React UI        │
                     │   Vite + Tailwind    │
                     └──────────┬───────────┘
                                │
                              Axios
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Node / Express     │
                     │       REST API       │
                     └──────────┬───────────┘
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
              ▼                 ▼                  ▼
        ┌───────────┐    ┌─────────────┐    ┌──────────────┐
        │ MongoDB   │    │ Cloudinary  │    │ Downscaling  │
        │           │    │             │    │   Service    │
        └───────────┘    └─────────────┘    └──────┬───────┘
                                                   │
                                      Current: Deterministic Mock Logic
                                                   │
                                      Future: AI/ML FastAPI Service
                                                   │
                                                   ▼
                                          Python / FastAPI
                                                   │
                                                   ▼
                                         ML Downscaling Model
```

---

## 5. Technology Stack

### Frontend
- **React 18** + **Vite** (JavaScript)
- **Tailwind CSS** (Responsive Agro-Meteorological UI)
- **React Router v6** (Role-protected routing)
- **Axios** (Centralized API client with credentials)
- **Context API** (`AuthContext`, `LocationContext`)
- **Recharts** (Temperature, Rainfall, Humidity, Wind, and Comparison charts)
- **Leaflet + React-Leaflet** (Interactive GIS map with Block GeoJSON boundaries)
- **Lucide React** (Icons)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** (with automatic fallback to `mongodb-memory-server` if local MongoDB is not running)
- **JWT** + **HTTP-only Cookies** + **bcrypt**
- **Multer** + **Cloudinary** (Document and agricultural image uploads)
- **CORS** + **dotenv**

---

## 6. Folder Structure

```text
weather-downscaling/
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── advisoryController.js
│   │   │   ├── alertController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── downscalingController.js
│   │   │   ├── locationController.js
│   │   │   ├── panchayatController.js
│   │   │   ├── userController.js
│   │   │   └── weatherController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── rateLimitMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── validateMiddleware.js
│   │   ├── models/
│   │   │   ├── Advisory.js
│   │   │   ├── Block.js
│   │   │   ├── District.js
│   │   │   ├── Panchayat.js
│   │   │   ├── State.js
│   │   │   ├── User.js
│   │   │   ├── WeatherAlert.js
│   │   │   └── WeatherForecast.js
│   │   ├── routes/
│   │   │   ├── advisoryRoutes.js
│   │   │   ├── alertRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── downscalingRoutes.js
│   │   │   ├── locationRoutes.js
│   │   │   ├── panchayatRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── weatherRoutes.js
│   │   ├── services/
│   │   │   ├── advisoryService.js
│   │   │   ├── aiClientService.js
│   │   │   ├── alertService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── authService.js
│   │   │   ├── downscalingService.js
│   │   │   ├── locationService.js
│   │   │   ├── riskService.js
│   │   │   └── weatherService.js
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   ├── apiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── geoUtils.js
│   │   ├── seed/
│   │   │   ├── seed.js
│   │   │   └── seedData.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── sampleBlockBoundaries.json
    │   ├── components/
    │   │   ├── advisory/
    │   │   ├── charts/
    │   │   ├── common/
    │   │   ├── map/
    │   │   └── weather/
    │   ├── context/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── farmer/
    │   │   ├── officer/
    │   │   └── public/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

---

## 7. Environment Variables

### Backend (`backend/.env.example`)
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/weather_downscaling
JWT_SECRET=your_jwt_secret_replace_in_production
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
DOWNSCALING_PROVIDER=prototype
```

### Frontend (`frontend/.env.example`)
```env
VITE_API_URL=http://localhost:4000/api
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## 8–12. Installation, Database Setup, Seed Data & Running the Project

### Step 1: Run the Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
*(Note: If a local MongoDB daemon is not running on `127.0.0.1:27017`, the backend automatically boots an embedded `MongoMemoryServer` instance and seeds the demo dataset on startup.)*

### Step 2: Run the Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 13. Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Password@123` |
| **Agriculture Officer** | `officer@example.com` | `Password@123` |
| **Farmer** | `farmer@example.com` | `Password@123` |

*(The `/login` page also includes 1-click instant demo login buttons for all three roles.)*

---

## 14. REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new user (`farmer` default)
- `POST /api/auth/login` — Authenticate and set HTTP-only JWT cookie
- `POST /api/auth/logout` — Clear auth cookie
- `GET /api/auth/me` — Get current logged-in user profile

### Locations & Panchayats
- `GET /api/locations/states` — List States
- `GET /api/locations/districts/:stateId` — List Districts in a State
- `GET /api/locations/blocks/:districtId` — List Blocks in a District
- `GET /api/locations/panchayats/:blockId` — List Panchayats in a Block
- `GET /api/panchayats` — List all Panchayats with latest weather & risk status
- `GET /api/panchayats/:id` — Get single Panchayat with 7-day forecast history
- `POST /api/panchayats` — Create Panchayat (Admin)
- `PUT /api/panchayats/:id` — Update Panchayat (Admin)
- `DELETE /api/panchayats/:id` — Delete Panchayat (Admin)

### Weather & Downscaling
- `GET /api/weather` — Query weather forecasts
- `POST /api/weather` — Create/Update Block or Panchayat weather forecast
- `GET /api/weather/panchayat/:panchayatId` — 7-day Panchayat weather
- `GET /api/weather/block/:blockId` — 7-day Block weather
- `GET /api/weather/compare?blockId=...&panchayatId=...&date=...` — Compare Block vs Panchayat
- `POST /api/downscaling/generate` — Generate simulated Panchayat forecasts from Block weather (`{ blockId, date }`)
- `GET /api/downscaling/:panchayatId` — Fetch downscaled forecasts & spatial metadata for a Panchayat

### Advisories, Alerts & Analytics
- `GET /api/advisories` / `POST /api/advisories` / `PUT /api/advisories/:id` / `DELETE /api/advisories/:id`
- `GET /api/alerts` / `POST /api/alerts` / `PUT /api/alerts/:id` / `DELETE /api/alerts/:id`
- `GET /api/analytics/dashboard` — Summary counts and averages
- `GET /api/analytics/weather-trends` — Aggregated 7-day meteorological trends
- `GET /api/analytics/risk-summary` — Rule-based risk distribution and high-risk watchlist

---

## 15. Prototype Downscaling Explanation

In `backend/src/services/downscalingService.js`, `simulatePanchayatWeather(blockWeather, panchayat, blockDoc)` deterministically adjusts Block-level weather using:
1. **Elevation Lapse Rate**: `-0.65°C` per `+100m` elevation delta relative to Block center.
2. **Vegetation Canopy Factor (`0.0–1.0`)**: Modulates evaporative cooling, surface wind reduction, and local relative humidity retention.
3. **Spatial Coordinate Signature**: Uses a deterministic hash (`FNV-1a` over Panchayat name and coordinates) and Haversine distance from the Block center so identical inputs always produce identical outputs without `Math.random()`.

---

## 16. Future AI/ML Integration Plan

When the Python/FastAPI ML Downscaling model is ready:
1. Deploy the FastAPI service exposing `POST /api/v1/downscale`.
2. Set `AI_SERVICE_URL=http://localhost:8000` and `DOWNSCALING_PROVIDER=ai_service` in `backend/.env`.
3. `generatePanchayatForecast()` in `backend/src/services/downscalingService.js` will automatically delegate to `requestAiDownscalingFromFastAPI()` in `aiClientService.js` with zero changes required in Express controllers or React components.
