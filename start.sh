#!/bin/bash

echo "🚀 Starting AI Agency App in Production Mode..."

# Set production environment
export NODE_ENV=production

# Generate Prisma client
echo "📊 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "🌟 Starting Next.js application..."
node server.js 