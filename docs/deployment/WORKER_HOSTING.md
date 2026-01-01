# 🏗️ Worker Hosting Strategy (Vercel & Beyond)

## ⚠️ The Vercel Limitation
The Vayva platform uses **BullMQ** for critical background processing (Payments, AI, WhatsApp, Delivery). 
**Vercel is a Serverless platform. It cannot run long-running persistent processes.** 

If you deploy the `worker` app to Vercel, it will fail to process the queue because serverless functions time out and don't maintain the necessary Redis event-loop connection.

---

## ✅ Recommended Deployment Pattern

### 1. Web Apps (Storefront, Merchant Admin, Ops Console)
- **Host:** [Vercel](https://vercel.com)
- **Deployment:** Standard Next.js deployment.
- **Role:** Producers (they add jobs to the queue).

### 2. Worker App (`apps/worker`)
- **Host:** [Fly.io](https://fly.io), [Render](https://render.com), [Railway](https://railway.app), or [AWS ECS](https://aws.amazon.com/ecs/).
- **Requirement:** A platform that supports persistent Docker containers or Node.js processes.
- **Configuration:**
  - Must point to the **same Redis instance** as the Web Apps.
  - Must point to the **same Database instance**.
  - Set `NODE_ENV=production`.

### 3. Redis Service
- **Provider:** [Upstash](https://upstash.com) (Serverless Redis) or [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/).
- **Role:** The message broker between Web Apps and the Worker.

---

## 🚀 Step-by-Step Deployment (Fly.io Example)

1. **Install Fly CLI**
2. **Launch from apps/worker:**
   ```bash
   cd apps/worker
   fly launch
   ```
3. **Set Secrets:**
   ```bash
   fly secrets set DATABASE_URL="..." REDIS_URL="..." GROQ_API_KEY="..."
   ```
4. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 🛠️ Verification in Production
After deployment, confirm the worker is active by checking the logs of your persistent host. You should see:
`[WORKER] Starting workers...`
`[WORKER] Workers started with full capability.`

Without this setup, your storefront orders will stay `PENDING` forever because the Paystack webhook will enqueue a job that no one is listening to.
