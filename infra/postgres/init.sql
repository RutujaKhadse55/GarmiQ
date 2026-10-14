-- Initial database configuration for GarmiQ
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Heat incident reports table
CREATE TABLE IF NOT EXISTS heat_incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id VARCHAR(50) NOT NULL,
    temperature_celsius NUMERIC(4, 2) NOT NULL,
    humidity_percentage NUMERIC(4, 2) NOT NULL,
    heat_index NUMERIC(4, 2) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
