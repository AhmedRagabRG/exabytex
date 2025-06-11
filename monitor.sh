#!/bin/bash

echo "🔍 AI Agency App - System Monitor"
echo "================================="

# Check if Docker Compose is running
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found!"
    exit 1
fi

echo ""
echo "📊 Container Status:"
echo "-------------------"
docker-compose ps

echo ""
echo "💾 System Resources:"
echo "-------------------"
echo "Memory Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "💿 Disk Usage:"
echo "-------------"
df -h | grep -E "/$|/mnt"

echo ""
echo "🌐 Network Connectivity:"
echo "------------------------"
# Test internal container connectivity
echo "Testing ai-agency-app connectivity..."
if docker-compose exec nginx ping -c 1 ai-agency-app &> /dev/null; then
    echo "✅ ai-agency-app is reachable"
else
    echo "❌ ai-agency-app is not reachable"
fi

echo "Testing postgres connectivity..."
if docker-compose exec ai-agency-app pg_isready -h postgres -p 5432 &> /dev/null; then
    echo "✅ PostgreSQL is reachable"
else
    echo "❌ PostgreSQL is not reachable"
fi

echo ""
echo "🔐 SSL Certificate Status:"
echo "--------------------------"
if [ -f "/mnt/srv/docker/cont/nginx/keys/letsencrypt/fullchain.pem" ]; then
    EXPIRY_DATE=$(docker run --rm -v /mnt/srv/docker/cont/nginx/keys/letsencrypt:/certs alpine:latest sh -c "cd /certs && openssl x509 -in fullchain.pem -text -noout | grep 'Not After' | cut -d: -f2-")
    echo "✅ SSL Certificate exists"
    echo "   Expires: $EXPIRY_DATE"
else
    echo "❌ SSL Certificate not found"
fi

echo ""
echo "📝 Recent Logs (Last 10 lines):"
echo "--------------------------------"
echo "AI Agency App logs:"
docker-compose logs --tail=5 ai-agency-app

echo ""
echo "Nginx logs:"
docker-compose logs --tail=5 nginx

echo ""
echo "🔗 Quick Access URLs:"
echo "--------------------"
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "🌐 Website: https://exabytex.com"
echo "🔧 Nginx Proxy Manager: http://$SERVER_IP:81"
echo "📊 Portainer: http://$SERVER_IP:9000"
echo "🤖 n8n: http://$SERVER_IP:5678"
echo "🗄️  WordPress: http://$SERVER_IP:8080"

echo ""
echo "📋 Health Check Summary:"
echo "------------------------"
HEALTHY_COUNT=0
TOTAL_COUNT=0

# Check each service
services=("ai-agency-app" "postgres" "nginx" "npm")
for service in "${services[@]}"; do
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    if docker-compose ps | grep -q "$service.*Up"; then
        echo "✅ $service: Running"
        HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
    else
        echo "❌ $service: Not running"
    fi
done

echo ""
echo "Overall Health: $HEALTHY_COUNT/$TOTAL_COUNT services running"

if [ $HEALTHY_COUNT -eq $TOTAL_COUNT ]; then
    echo "🎉 All systems operational!"
    exit 0
else
    echo "⚠️  Some services need attention"
    exit 1
fi 