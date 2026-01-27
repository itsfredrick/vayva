# VPS App Server Deploy (163.245.209.202)

## Prerequisites
- Logged in as vayva-app (non-root sudo user)
- Docker and Docker Compose installed
- UFW firewall configured

## Deploy stack
```bash
# Create deploy directory
mkdir -p ~/vayva && cd ~/vayva

# Copy files from repo (run these from your laptop)
scp -r scripts/deploy/. vayva-app@163.245.209.202:~/vayva/

# On the server:
cd ~/vayva
docker-compose -f docker-compose.app.yml --env-file .env.app up -d
```

## Services exposed
- MinIO Console: http://163.245.209.202:9001 (admin/T0cxFcKjcdYmHNBrJpVc2JvzjggXAUIP4xl7apcvpiY=)
- Evolution API: http://163.245.209.202:8080
- Nginx Proxy Manager: http://163.245.209.202:81 (default admin@example.com / changeme)
- Redis: localhost:6379 (internal)

## Post-deploy
1. Login to Nginx Proxy Manager (port 81) and:
   - Change default admin email/password
   - Add SSL certs for:
     - s3.vayva.ng → proxy to MinIO port 9000
     - api.vayva.ng → proxy to Evolution API port 8080
2. Create MinIO bucket `vayva-uploads` via Console or API
3. Test MinIO connectivity from Vercel apps using endpoint https://s3.vayva.ng
