# Vercel Deployment Guide for Vayva

This guide will walk you through deploying all three Vayva applications to Vercel.

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] A database provider account (Neon, Vercel Postgres, or Supabase)
- [ ] A Paystack account for payments
- [ ] A Resend account for emails
- [ ] Your GitHub repository pushed to `main` branch

## 🎯 Deployment Overview

You will create **3 separate Vercel projects**:

1. **Marketing Site** (`apps/marketing`) → `www.yourdomain.com`
2. **Merchant Admin** (`apps/merchant-admin`) → `app.yourdomain.com`
3. **Ops Console** (`apps/ops-console`) → `ops.yourdomain.com`

---

## Step 1: Set Up Your Database

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click **Create Project**
3. Choose a name: `vayva-production`
4. Select region closest to your users
5. Click **Create Project**
6. Copy the connection string (it looks like):
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname
   ```
7. **Save this** - you'll need it for Vercel environment variables

### Option B: Vercel Postgres

1. Go to your Vercel dashboard
2. Click **Storage** → **Create Database**
3. Select **Postgres**
4. Name it `vayva-production`
5. Vercel will automatically add environment variables to your projects

### Option C: Supabase

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Fill in project details
4. Go to **Settings** → **Database**
5. Copy the **Connection Pooling** string (port 6543)
6. **Save this** - you'll need it for Vercel

---

## Step 2: Run Database Migrations

**IMPORTANT:** Do this BEFORE deploying to Vercel!

1. Open your terminal in the project root
2. Set your production database URL:
   ```bash
   export DATABASE_URL="postgresql://your-connection-string-here"
   ```

3. Run migrations:
   ```bash
   cd packages/db
   pnpm prisma migrate deploy
   ```

4. Verify migrations succeeded:
   ```bash
   pnpm prisma db push
   ```

5. (Optional) Seed initial data:
   ```bash
   pnpm prisma db seed
   ```

---

## Step 3: Generate Required Secrets

Run this command to generate your NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

**Save the output** - you'll need it for environment variables.

---

## Step 4: Deploy Marketing Site

### 4.1 Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `vayva-platform` repository
4. Click **Import**

### 4.2 Configure Project Settings

**Project Name:** `vayva-marketing` (or your preferred name)

**Framework Preset:** Next.js

**Root Directory:** Click **Edit** → Select `apps/marketing`

**Build Settings:**
- **Build Command:** Leave as default (Vercel will use vercel.json)
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Important:** Check the box for:
- ✅ **Include source files outside of the Root Directory in the Build Step**

### 4.3 Add Environment Variables

Click **Environment Variables** and add these:

```bash
# Required
DATABASE_URL=postgresql://your-neon-connection-string
DIRECT_URL=postgresql://your-neon-connection-string
NEXTAUTH_SECRET=your-generated-secret-from-step-3
NEXTAUTH_URL=https://your-marketing-domain.vercel.app
APP_URL=https://your-merchant-admin-domain.vercel.app
MARKETING_URL=https://your-marketing-domain.vercel.app
OPS_URL=https://your-ops-domain.vercel.app
NODE_ENV=production

# Optional (add later if needed)
RESEND_API_KEY=your_resend_key
PAYSTACK_PUBLIC_KEY=pk_live_xxx
```

**For each variable:**
- Select **Production**, **Preview**, and **Development**
- Click **Add**

### 4.4 Deploy

1. Click **Deploy**
2. Wait for deployment to complete (~3-5 minutes)
3. Click **Visit** to see your marketing site
4. **Copy the deployment URL** (e.g., `vayva-marketing.vercel.app`)

---

## Step 5: Deploy Merchant Admin

### 5.1 Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same** `vayva-platform` repository
3. Click **Import**

### 5.2 Configure Project Settings

**Project Name:** `vayva-merchant-admin`

**Framework Preset:** Next.js

**Root Directory:** Click **Edit** → Select `apps/merchant-admin`

**Build Settings:**
- **Build Command:** Leave as default
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Important:** Check the box for:
- ✅ **Include source files outside of the Root Directory in the Build Step**

### 5.3 Add Environment Variables

Add ALL the same variables from Step 4.3, PLUS these additional ones:

```bash
# All variables from marketing, PLUS:
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
RESEND_API_KEY=re_your_api_key
GROQ_API_KEY=gsk_your_groq_key (optional)

# Update APP_URL to this project's URL
APP_URL=https://your-merchant-admin-domain.vercel.app
```

### 5.4 Deploy

1. Click **Deploy**
2. Wait for deployment (~3-5 minutes)
3. **Copy the deployment URL**

---

## Step 6: Deploy Ops Console

### 6.1 Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new) one more time
2. Import the **same** `vayva-platform` repository
3. Click **Import**

### 6.2 Configure Project Settings

**Project Name:** `vayva-ops-console`

**Framework Preset:** Next.js

**Root Directory:** Click **Edit** → Select `apps/ops-console`

**Build Settings:**
- **Build Command:** Leave as default
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Important:** Check the box for:
- ✅ **Include source files outside of the Root Directory in the Build Step**

### 6.3 Add Environment Variables

Add the same core variables:

```bash
DATABASE_URL=postgresql://your-neon-connection-string
DIRECT_URL=postgresql://your-neon-connection-string
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-ops-domain.vercel.app
APP_URL=https://your-merchant-admin-domain.vercel.app
MARKETING_URL=https://your-marketing-domain.vercel.app
OPS_URL=https://your-ops-domain.vercel.app
NODE_ENV=production
```

### 6.4 Deploy

1. Click **Deploy**
2. Wait for deployment
3. **Copy the deployment URL**

---

## Step 7: Update Environment Variables

Now that all three apps are deployed, update the URLs:

### For Each Project:

1. Go to **Settings** → **Environment Variables**
2. Update these variables with your actual Vercel URLs:
   - `NEXTAUTH_URL` → Your project's URL
   - `APP_URL` → Merchant admin URL
   - `MARKETING_URL` → Marketing URL
   - `OPS_URL` → Ops console URL
3. Click **Save**
4. Go to **Deployments** → Click **⋯** → **Redeploy**

---

## Step 8: Configure External Services

### Paystack Setup

1. Go to [dashboard.paystack.com](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy your **Live Secret Key** and **Live Public Key**
4. Add webhook URL: `https://your-merchant-admin-url.vercel.app/api/webhooks/paystack`
5. Update environment variables in Vercel with your keys
6. Redeploy merchant-admin

### Resend Setup

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Go to **Domains** → Add your domain
4. Add the DNS records shown (for sending emails from your domain)
5. Add webhook URL: `https://your-merchant-admin-url.vercel.app/api/webhooks/resend`
6. Update `RESEND_API_KEY` in Vercel
7. Redeploy merchant-admin

---

## Step 9: Add Custom Domains (Optional)

### For Each Project:

1. Go to project **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain:
   - Marketing: `www.yourdomain.com` or `yourdomain.com`
   - Merchant Admin: `app.yourdomain.com`
   - Ops Console: `ops.yourdomain.com`
4. Vercel will show you DNS records to add
5. Go to your domain registrar (Namecheap, GoDaddy, etc.)
6. Add the DNS records shown by Vercel
7. Wait for DNS propagation (~5-30 minutes)
8. SSL certificate will be issued automatically

---

## Step 10: Verify Deployment

### Test Each App:

**Marketing Site:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Links to merchant admin work

**Merchant Admin:**
- [ ] Can access signup page
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Database connection works

**Ops Console:**
- [ ] Can access login page
- [ ] Can login with ops credentials
- [ ] Dashboard loads
- [ ] Can view merchants

### Test Integrations:

- [ ] Create a test order with Paystack
- [ ] Verify email sending works
- [ ] Check webhook logs in Paystack dashboard
- [ ] Test WhatsApp integration (if configured)

---

## 🚨 Troubleshooting

### Build Fails

**Error:** `Cannot find module '@vayva/db'`

**Solution:**
1. Go to **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Enable: ✅ **Include source files outside of the Root Directory**
4. Redeploy

### Database Connection Fails

**Error:** `Can't reach database server`

**Solution:**
1. Check `DATABASE_URL` is correct
2. For Supabase, use connection pooling URL (port 6543)
3. Verify database allows connections from anywhere (0.0.0.0/0)
4. Check `DIRECT_URL` is also set

### Environment Variables Not Working

**Solution:**
1. Make sure variables are set for **Production**, **Preview**, AND **Development**
2. After adding new variables, always **Redeploy**
3. Check for typos in variable names (they're case-sensitive)

### 404 on API Routes

**Solution:**
1. Verify the app built successfully
2. Check build logs for errors
3. Ensure `vercel.json` is in the app directory
4. Redeploy the project

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard

Each project shows:
- **Deployments:** History of all deployments
- **Analytics:** Page views, performance
- **Logs:** Real-time application logs
- **Speed Insights:** Performance metrics

### Check Logs

1. Go to your project
2. Click **Deployments**
3. Click on latest deployment
4. Click **View Function Logs** or **Build Logs**

---

## 🎉 You're Done!

Your Vayva platform is now live on Vercel!

**Next Steps:**
- Set up monitoring/alerts
- Configure backup strategy for database
- Set up staging environment (optional)
- Enable Vercel Analytics (optional)
- Configure rate limiting (optional)

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check function logs for runtime errors
3. Verify all environment variables are set
4. Ensure database migrations ran successfully
5. Check external service webhooks are configured

**Common Issues Document:** See `TROUBLESHOOTING.md` for detailed solutions.
