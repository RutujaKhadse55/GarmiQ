# API Contracts & Specifications

The single source of truth for GarmiQ endpoints is defined in `contracts/openapi.yaml`.

## Schema Guidelines
- All domain entity schemas are located in `contracts/schemas/`.
- Mock fixture responses for offline frontend development are stored in `contracts/fixtures/`.
- Backend endpoints must validate request and response payloads matching these contracts.
