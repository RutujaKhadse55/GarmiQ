# GarmiQ Architecture Overview

## Overview
GarmiQ collects thermal sensor feeds, satellite imagery, and meteorological data to calculate granular heat risk scores. It distributes actionable warnings to citizens and empowers authorities with citywide mitigation planning.

## Components
1. **Frontend Web Dashboard (`frontend/web-dashboard`)**:
   - Built for municipal authorities, disaster management teams, and emergency responders.
   - Real-time heatmaps, risk monitoring by zone, dispatching advisories, and post-event reporting.

2. **Frontend Citizen App (`frontend/citizen-app`)**:
   - Lightweight, mobile-first responsive application for residents.
   - Current heat risk, proximity to cooling centers and hydration spots, emergency helpline access.

3. **Backend Service (`backend/`)**:
   - Python FastAPI service providing microservice API routers.
   - Core API endpoints: health, heat-risk, heatmap, alerts, safe-places, reports.
   - Modular structure with schemas, models, services, repositories, and future ML/RAG agents.

4. **Shared Monorepo Packages (`packages/`)**:
   - `@garmiq/types`: TypeScript interfaces shared across web applications.
   - `@garmiq/api-client`: Standard client library for communicating with backend.
   - `@garmiq/ui`: Reusable component library.

5. **Contracts & Validation (`contracts/`)**:
   - OpenAPI specifications and JSON Schemas ensure strict contracts between teams.
