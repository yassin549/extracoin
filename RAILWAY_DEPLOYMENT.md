# 🚂 Railway Deployment Guide for ExtraCoin

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Railway Account** - Sign up at https://railway.app
3. **Credit Card** (optional) - For beyond free tier ($5/month credit)

---

## 🚀 Deployment Steps

### **Step 1: Push Code to GitHub**

```bash
cd "c:\Users\khoua\OneDrive\Desktop\crypto exchange"
git init
git add .
git commit -m "Initial commit - ExtraCoin platform"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/extracoin.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Create Railway Project**

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `extracoin` repository

---

### **Step 3: Deploy Services (4 Services Total)**

#### **Service 1: PostgreSQL Database**

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create the database
4. Copy the `DATABASE_URL` (we'll need this later)

#### **Service 2: Redis**

1. Click **"+ New"** → **"Database"** → **"Redis"**
2. Railway will create Redis instance
3. Copy the `REDIS_URL`

#### **Service 3: Backend API**

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repo → Choose **root directory**
3. Click **"Add Variables"** and add these:

**Required Environment Variables:**

```env
# Database (automatically set by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# URLs (will update after deployment)
API_URL=https://extracoin-api-production.up.railway.app
FRONTEND_URL=https://extracoin-production.up.railway.app
CORS_ORIGINS=https://extracoin-production.up.railway.app

# NOWPayments
NOWPAYMENTS_API_KEY=A53GE0J-PPD4G6Z-NFVAC23-GNBEFAH
NOWPAYMENTS_PUBLIC_KEY=c83c4ff4-30e7-4bd8-8d91-4d4912ac5863
NOWPAYMENTS_IPN_SECRET=OemSUwv9OSlRrCjhEV5lMTzfBGKanpen
NOWPAYMENTS_BASE_URL=https://api.nowpayments.io/v1
```

4. Set **Root Directory** to: `apps/api`
5. Set **Build Command**: `pip install -r requirements.txt`
6. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Click **"Deploy"**

#### **Service 4: Frontend (Next.js)**

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repo → Choose **root directory**
3. Click **"Add Variables"**:

```env
NEXT_PUBLIC_API_URL=https://extracoin-api-production.up.railway.app
```

4. Set **Root Directory** to: `apps/web`
5. Set **Build Command**: `npm install && npm run build`
6. Set **Start Command**: `npm start`
7. Click **"Deploy"**

---

### **Step 4: Run Database Migrations**

Once the API is deployed:

1. Go to your API service in Railway
2. Click on **"Settings"** → **"Service"**
3. Open **"Railway CLI"** or use the web terminal
4. Run migrations:

```bash
alembic upgrade head
```

5. Seed investment tiers:

```bash
python -m app.scripts.seed_investment_tiers
```

---

### **Step 5: Update Environment Variables**

After all services are deployed, you'll get URLs like:
- Frontend: `https://extracoin-production.up.railway.app`
- Backend: `https://extracoin-api-production.up.railway.app`

**Update these in your services:**

**Backend API Service:**
- `API_URL` = your actual API URL
- `FRONTEND_URL` = your actual frontend URL
- `CORS_ORIGINS` = your actual frontend URL

**Frontend Service:**
- `NEXT_PUBLIC_API_URL` = your actual API URL

**Redeploy both services after updating.**

---

### **Step 6: Configure NOWPayments Webhook**

1. Log in to NOWPayments dashboard: https://account.nowpayments.io
2. Go to **Settings** → **IPN Callbacks**
3. Set IPN URL to:
   ```
   https://YOUR-API-URL.up.railway.app/api/investment/deposits/webhook
   ```
4. Save settings

---

## 🔍 **Verify Deployment**

### **Check API:**
```bash
curl https://YOUR-API-URL.up.railway.app/health
```

Should return: `{"status":"healthy","version":"2.0.0"}`

### **Check Frontend:**
Visit: `https://YOUR-FRONTEND-URL.up.railway.app`

### **Check Database:**
Visit: `https://YOUR-API-URL.up.railway.app/docs`
- Try API endpoints
- Check if investment tiers are seeded

---

## 💰 **Railway Pricing**

### **Free Tier:**
- $5 credit per month
- Enough for small projects
- ~500 hours of usage

### **Estimated Monthly Cost:**
- **PostgreSQL**: ~$2-3/month
- **Redis**: ~$1-2/month
- **API**: ~$2-3/month
- **Frontend**: ~$1-2/month
- **Total**: ~$6-10/month

**Tip:** Railway's $5 free credit covers most of this!

---

## 🛠️ **Troubleshooting**

### **Build Fails:**
1. Check build logs in Railway
2. Ensure `requirements.txt` and `package.json` are correct
3. Check Python version (3.11+) and Node version (18+)

### **Database Connection Error:**
1. Verify `DATABASE_URL` is set correctly
2. Check if PostgreSQL service is running
3. Ensure database migrations ran successfully

### **CORS Error:**
1. Update `CORS_ORIGINS` in API to match frontend URL
2. Redeploy API service

### **NOWPayments Webhook Not Working:**
1. Ensure IPN URL is HTTPS (Railway provides this)
2. Verify IPN secret matches in environment variables
3. Check API logs for webhook errors

---

## 📊 **Service URLs Reference**

After deployment, your URLs will be:

| Service | URL Format | Example |
|---------|-----------|---------|
| Frontend | `https://[app-name]-production.up.railway.app` | `https://extracoin-production.up.railway.app` |
| API | `https://[app-name]-api-production.up.railway.app` | `https://extracoin-api-production.up.railway.app` |
| API Docs | `https://[api-url]/docs` | `https://extracoin-api-production.up.railway.app/docs` |

---

## 🔐 **Security Checklist**

Before going live:

- [ ] Change `SECRET_KEY` to a strong random string (32+ characters)
- [ ] Update NOWPayments webhook URL
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Set strong database password (Railway does this)
- [ ] Review CORS settings
- [ ] Test payment flow end-to-end
- [ ] Verify KYC upload works
- [ ] Test all API endpoints

---

## 🎯 **Next Steps After Deployment**

1. **Test Everything:**
   - Sign up flow
   - KYC submission
   - Investment tier selection
   - Crypto deposit
   - Account balance update

2. **Custom Domain (Optional):**
   - Purchase domain (e.g., extracoin.com)
   - Add to Railway project
   - Update environment variables

3. **Monitoring:**
   - Check Railway logs regularly
   - Monitor NOWPayments dashboard
   - Track user signups and deposits

4. **Backup:**
   - Railway auto-backs up PostgreSQL
   - Consider additional backups for safety

---

## 📞 **Support**

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **NOWPayments Support:** https://nowpayments.io/help

---

## ✅ **Quick Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] PostgreSQL database added
- [ ] Redis database added
- [ ] Backend API deployed with env vars
- [ ] Frontend deployed with env vars
- [ ] Database migrations run
- [ ] Investment tiers seeded
- [ ] Environment URLs updated
- [ ] Services redeployed
- [ ] NOWPayments webhook configured
- [ ] All endpoints tested
- [ ] Domain configured (optional)

---

**Estimated Total Deployment Time:** 30-45 minutes

**Free Tier Duration:** Ongoing with $5/month credit (may need to add payment method)

---

*Happy Deploying! 🚀*
