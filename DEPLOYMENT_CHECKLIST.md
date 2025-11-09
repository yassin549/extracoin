# ✅ Railway Deployment Checklist

## Before You Start

- [ ] Read `RAILWAY_DEPLOYMENT.md` fully
- [ ] Have GitHub account ready
- [ ] Have Railway account ready (sign up at https://railway.app)
- [ ] Verify all code is working locally

---

## Step 1: Generate SECRET_KEY ⏱️ 1 min

```bash
python generate_secret_key.py
```

- [ ] Copy the generated key
- [ ] Save it somewhere safe (you'll need it for Railway)

---

## Step 2: Push to GitHub ⏱️ 5 mins

```bash
cd "c:\Users\khoua\OneDrive\Desktop\crypto exchange"

# Initialize Git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ExtraCoin platform ready for deployment"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/extracoin.git
git branch -M main
git push -u origin main
```

- [ ] Repository created on GitHub
- [ ] All code pushed successfully
- [ ] Verified files are on GitHub

---

## Step 3: Create Railway Project ⏱️ 2 mins

1. [ ] Go to https://railway.app
2. [ ] Sign up / Log in
3. [ ] Click "Start a New Project"
4. [ ] Select "Deploy from GitHub repo"
5. [ ] Authorize Railway to access GitHub
6. [ ] Select your `extracoin` repository

---

## Step 4: Add PostgreSQL ⏱️ 2 mins

1. [ ] In Railway project, click "+ New"
2. [ ] Select "Database" → "PostgreSQL"
3. [ ] Wait for deployment to complete
4. [ ] Click on PostgreSQL service
5. [ ] Copy `DATABASE_URL` from Variables tab

---

## Step 5: Add Redis ⏱️ 2 mins

1. [ ] Click "+ New" → "Database" → "Redis"
2. [ ] Wait for deployment
3. [ ] Copy `REDIS_URL` from Variables tab

---

## Step 6: Deploy Backend API ⏱️ 10 mins

### 6.1 Create Service

1. [ ] Click "+ New" → "GitHub Repo"
2. [ ] Select your repository
3. [ ] Name it: `extracoin-api`

### 6.2 Configure Settings

1. [ ] Go to Settings → Root Directory
2. [ ] Set to: `apps/api`
3. [ ] Go to Settings → Build
4. [ ] Set Build Command: `pip install -r requirements.txt`
5. [ ] Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 6.3 Add Environment Variables

Go to Variables tab and add ALL of these:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
SECRET_KEY=paste-your-generated-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
NOWPAYMENTS_API_KEY=A53GE0J-PPD4G6Z-NFVAC23-GNBEFAH
NOWPAYMENTS_PUBLIC_KEY=c83c4ff4-30e7-4bd8-8d91-4d4912ac5863
NOWPAYMENTS_IPN_SECRET=OemSUwv9OSlRrCjhEV5lMTzfBGKanpen
NOWPAYMENTS_BASE_URL=https://api.nowpayments.io/v1
APP_NAME=ExtraCoin
ENVIRONMENT=production
DEBUG=False
MIN_DEPOSIT_USD=10.0
MIN_WITHDRAWAL_USD=20.0
WITHDRAWAL_FEE_PERCENT=1.0
```

**Note:** Leave API_URL, FRONTEND_URL, and CORS_ORIGINS empty for now

- [ ] All environment variables added
- [ ] Click "Deploy" and wait for build

### 6.4 Note Your API URL

After deployment completes:

1. [ ] Go to Settings → Domains
2. [ ] Copy the Railway domain (e.g., `extracoin-api-production.up.railway.app`)
3. [ ] Save this URL - you'll need it next

Your API URL: `____________________________________`

---

## Step 7: Deploy Frontend ⏱️ 10 mins

### 7.1 Create Service

1. [ ] Click "+ New" → "GitHub Repo"
2. [ ] Select your repository
3. [ ] Name it: `extracoin-web`

### 7.2 Configure Settings

1. [ ] Go to Settings → Root Directory
2. [ ] Set to: `apps/web`
3. [ ] Go to Settings → Build
4. [ ] Set Build Command: `npm install && npm run build`
5. [ ] Set Start Command: `npm start`

### 7.3 Add Environment Variables

```env
NEXT_PUBLIC_API_URL=https://YOUR-API-URL-FROM-STEP-6.up.railway.app
```

- [ ] Environment variable added
- [ ] Click "Deploy" and wait

### 7.4 Note Your Frontend URL

After deployment:

1. [ ] Go to Settings → Domains
2. [ ] Copy the Railway domain
3. [ ] Save this URL

Your Frontend URL: `____________________________________`

---

## Step 8: Update Environment Variables ⏱️ 3 mins

### 8.1 Update Backend API

Go to your API service → Variables → Add these:

```env
API_URL=https://YOUR-API-URL.up.railway.app
FRONTEND_URL=https://YOUR-FRONTEND-URL.up.railway.app
CORS_ORIGINS=https://YOUR-FRONTEND-URL.up.railway.app
```

- [ ] Variables updated
- [ ] Click "Redeploy" (top right)

### 8.2 Update Frontend

Already done in Step 7.3!

---

## Step 9: Run Database Migrations ⏱️ 5 mins

### Option A: Using Railway CLI (Recommended)

1. [ ] Install Railway CLI: `npm i -g @railway/cli`
2. [ ] Login: `railway login`
3. [ ] Link project: `railway link`
4. [ ] Select your API service
5. [ ] Run migrations:

```bash
railway run alembic upgrade head
railway run python -m app.scripts.seed_investment_tiers
```

### Option B: Using Railway Dashboard

1. [ ] Go to API service → Settings
2. [ ] Scroll to "Service" section
3. [ ] Click "New Deployment" → "Custom Command"
4. [ ] Run: `alembic upgrade head`
5. [ ] Wait for completion
6. [ ] Run again with: `python -m app.scripts.seed_investment_tiers`

- [ ] Migrations completed successfully
- [ ] Investment tiers seeded

---

## Step 10: Configure NOWPayments Webhook ⏱️ 3 mins

1. [ ] Go to https://account.nowpayments.io
2. [ ] Log in with your NOWPayments account
3. [ ] Navigate to Settings → IPN Callbacks
4. [ ] Set IPN Callback URL to:

```
https://YOUR-API-URL.up.railway.app/api/investment/deposits/webhook
```

5. [ ] Save settings

- [ ] Webhook URL configured
- [ ] IPN secret matches your environment variable

---

## Step 11: Test Deployment ⏱️ 10 mins

### 11.1 Test API Health

Visit: `https://YOUR-API-URL.up.railway.app/health`

Should return:
```json
{"status":"healthy","version":"2.0.0"}
```

- [ ] API health check passed

### 11.2 Test API Documentation

Visit: `https://YOUR-API-URL.up.railway.app/docs`

- [ ] Swagger UI loads
- [ ] Can see all endpoints
- [ ] Can test authentication

### 11.3 Test Frontend

Visit: `https://YOUR-FRONTEND-URL.up.railway.app`

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Investment plans page loads (/invest)
- [ ] Signin page loads (/auth/signin)

### 11.4 Test Full User Flow

1. [ ] Sign up for new account
2. [ ] Log in successfully
3. [ ] View investment tiers
4. [ ] Check KYC page loads (/kyc)
5. [ ] API calls work (check browser console - no errors)

---

## Step 12: Monitor & Verify ⏱️ 5 mins

### Check Railway Logs

**API Logs:**
1. [ ] Go to API service → Deployments
2. [ ] Click on latest deployment
3. [ ] View logs - no critical errors

**Frontend Logs:**
1. [ ] Go to Web service → Deployments
2. [ ] Check for build/runtime errors

### Check Database

1. [ ] Go to PostgreSQL service
2. [ ] Check "Metrics" tab - database is running
3. [ ] Check "Logs" - no connection errors

### Check Redis

1. [ ] Go to Redis service
2. [ ] Verify it's running

- [ ] All services healthy
- [ ] No critical errors in logs

---

## 🎉 Deployment Complete!

Your ExtraCoin platform is now live!

### Your URLs:

**Frontend:** https://YOUR-FRONTEND-URL.up.railway.app
**API:** https://YOUR-API-URL.up.railway.app
**API Docs:** https://YOUR-API-URL.up.railway.app/docs

---

## 📊 Post-Deployment

### Share Your Platform:

- [ ] Test with real users
- [ ] Share frontend URL
- [ ] Monitor for issues

### Optional Enhancements:

- [ ] Add custom domain ($10-15/year)
- [ ] Set up monitoring/alerts
- [ ] Enable Railway metrics
- [ ] Configure backups

---

## 🆘 Troubleshooting

### Build Fails:
- Check Railway logs
- Verify Python/Node versions
- Check requirements.txt and package.json

### Database Connection Error:
- Verify DATABASE_URL is set
- Check PostgreSQL service is running
- Ensure migrations ran

### CORS Error:
- Update CORS_ORIGINS to match frontend URL
- Redeploy API

### 404 Errors:
- Check root directory settings
- Verify build/start commands
- Check service logs

---

## 💰 Cost Tracking

Railway provides $5 free credit per month.

Monitor your usage:
1. [ ] Go to project Settings → Usage
2. [ ] Check estimated monthly cost
3. [ ] Add payment method if needed (costs typically $6-10/month)

---

## ✅ Final Checklist

- [ ] All 4 services deployed (API, Web, PostgreSQL, Redis)
- [ ] Environment variables configured correctly
- [ ] Database migrations completed
- [ ] Investment tiers seeded
- [ ] NOWPayments webhook configured
- [ ] Full user flow tested
- [ ] No critical errors in logs
- [ ] URLs documented and saved

**Total Time:** ~45-60 minutes

---

**🚀 Congratulations! Your ExtraCoin platform is LIVE!**

Share your frontend URL and start accepting investments! 💰
