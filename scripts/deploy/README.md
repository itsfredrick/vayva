# Vayva Deployment Guide (InterServer)

## Server 1: Database

1. SSH into the server.
2. Run the initialization script:

   ```bash
   bash scripts/deploy/setup-db-server.sh <SERVER_2_IP>
   ```

3. Create the database and user:

   ```bash
   sudo -u postgres psql
   CREATE DATABASE vayva;
   CREATE USER vayva_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vayva TO vayva_user;
   ```

## Server 2: Application

1. Install Docker:

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. Copy `scripts/deploy/docker-compose.app.yml` to the server as `docker-compose.yml`.
3. Create a `.env` file with your credentials:

   ```env
   MINIO_ROOT_USER=admin
   MINIO_ROOT_PASSWORD=your_secure_minio_password
   EVO_API_KEY=your_secret_evolution_key
   DB_USER=vayva_user
   DB_PASS=your_secure_password
   DB_HOST=<SERVER_1_IP>
   DB_NAME=vayva
   ```

4. Start the stack:

   ```bash
   docker compose up -d
   ```

5. Access Nginx Proxy Manager on port 81 to configure your domains and SSL.
