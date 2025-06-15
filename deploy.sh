#!/bin/bash

echo "🚀 Starting AI Agency App Deployment for exabytex.com..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with all required environment variables."
    exit 1
fi

# Make sure init-data.sh is executable
chmod +x init-data.sh

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 30

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec ai-agency-app npx prisma migrate deploy
docker-compose exec ai-agency-app npx prisma generate

# Create admin user
echo "👤 Creating admin user..."
docker-compose exec ai-agency-app npx prisma db seed

# Show running containers
echo "📋 Running containers:"
docker-compose ps

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your AI Agency App is now running at:"
echo "   - Internal: http://localhost:3000"
echo "   - Production: https://exabytex.com (after domain setup)"
echo ""
echo "🔧 Management URLs:"
echo "   - Nginx Proxy Manager: http://your-server-ip:81"
echo "   - Portainer: http://your-server-ip:9000"
echo ""
echo "📝 Next steps:"
echo "   1. Setup domain DNS to point to your server IP"
echo "   2. Wait for DNS propagation (5-60 minutes)"
echo "   3. Run SSL setup: chmod +x setup-ssl.sh && ./setup-ssl.sh"
echo "   4. Test the website: https://exabytex.com"
echo ""
echo "🔧 Alternative SSL setup:"
echo "   - Use Nginx Proxy Manager at http://your-server-ip:81"
echo "   - Add proxy host for exabytex.com → ai-agency-app:3000" 