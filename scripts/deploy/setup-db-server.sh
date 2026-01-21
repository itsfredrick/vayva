#!/bin/bash
# Server 1 Initialization Script (Database)
# Usage: ./setup-db-server.sh <APP_SERVER_IP>

APP_IP=$1

if [ -z "$APP_IP" ]; then
    echo "Usage: ./setup-db-server.sh <APP_SERVER_IP>"
    exit 1
fi

echo "🚀 Initializing Database Server..."

# Update and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y postgresql-16 postgresql-contrib redis-server ufw

# Configure Firewall
echo "🛡 Configuring Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow from "$APP_IP" to any port 5432
sudo ufw allow from "$APP_IP" to any port 6379
sudo ufw --force enable

# Configure PostgreSQL for remote access
echo "🐘 Configuring PostgreSQL..."
PG_CONF="/etc/postgresql/16/main/postgresql.conf"
PG_HBA="/etc/postgresql/16/main/pg_hba.conf"

sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
echo "host    all             all             $APP_IP/32            md5" | sudo tee -a "$PG_HBA"

sudo systemctl restart postgresql

# Configure Redis for remote access
echo "📦 Configuring Redis..."
REDIS_CONF="/etc/redis/redis.conf"
sudo sed -i "s/bind 127.0.0.1 ::1/bind 0.0.0.0/" "$REDIS_CONF"
sudo systemctl restart redis

echo "✅ Database Server Initialized!"
echo "Next: Create a database user and database."
