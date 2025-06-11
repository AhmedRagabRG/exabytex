#!/bin/bash
set -e

echo "🚀 Initializing AI Agency Database..."

# Create AI Agency database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ai_agency_db;
    GRANT ALL PRIVILEGES ON DATABASE ai_agency_db TO $POSTGRES_NON_ROOT_USER;
EOSQL

echo "✅ AI Agency Database initialized successfully!" 