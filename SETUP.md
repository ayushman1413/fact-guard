# 🚀 FactGuard Complete Setup Guide

This guide walks you through setting up, testing, and deploying FactGuard from scratch.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Get Free API Keys](#get-free-api-keys)
3. [Local Development](#local-development)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have:

- **Node.js 18+** — [Download](https://nodejs.org/)
  ```bash
  node --version  # Should be v18 or higher
  ```
- **Git** — [Download](https://git-scm.com/)
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **GitHub account** — [github.com](https://github.com)
- **Render account** (for backend) — [render.com](https://render.com)
- **Vercel account** (for frontend) — [vercel.com](https://vercel.com)

---

## Get Free API Keys

### 1️⃣ Groq API Key (Recommended - Completely Free & Unlimited)

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Click **Sign Up** → Choose **Sign up with GitHub**
3. Once logged in, click **Create New API Key**
4. Copy the key and save it safely
5. **No credit card needed, no limits, completely free!**

✨ **Why Groq?** Unlimited free tier, powerful Llama 3.3 model, perfect for production.

### 2️⃣ Tavily Search API Key

1. Go to [tavily.com](https://tavily.com)
2. Click **Sign Up** → Fill in your details
3. Go to **Dashboard** → **API Key**
4. Copy your API key
5. **Free tier includes 1,000 searches/month** (enough for testing)

### 3️⃣ MongoDB URI (Optional - For Report Storage)

Skip this if you don't want to store reports persistently.

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click **Sign Up** → Create your account
3. Create a new **M0 (Free) cluster**
4. Once created, click **Connect** → **Drivers** → Copy connection string
5. Replace `<username>` and `<password>` with your database credentials
6. Example: `mongodb+srv://user:password@cluster0.mongodb.net/factguard?retryWrites=true&w=majority`

---

## Local Development

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/factguard.git
cd factguard
```

### Step 2: Backend Setup

```bash
cd backend

# Copy the example environment file
cp .env.example .env

# Edit .env with your API keys
# Use your favorite editor (VS Code, nano, etc.)
nano .env
```

**Fill in your .env file:**
```env
GROQ_API_KEY=your_groq_key_here
TAVILY_API_KEY=your_tavily_key_here
MONGODB_URI=mongodb+srv://... (optional)
FRONTEND_URL=http://localhost:5173
PORT=5000
VERIFICATION_MODE=mock
MAX_CLAIMS_PER_PDF=10
RATE_LIMIT_DELAY=300
```

**Install dependencies and run:**
```bash
npm install
npm run dev
```

✅ **Expected output:**
```
✓ Connected to MongoDB (or [WARNING] if not set)
✓ FactGuard API running on port 5000
```

Visit [http://localhost:5000](http://localhost:5000) — should see:
```json
{ "status": "FactGuard API is live" }
```

### Step 3: Frontend Setup

**In a new terminal window:**

```bash
cd frontend

# Copy the example environment file
cp .env.example .env

# Edit .env (set API URL to backend)
nano .env
```

**Fill in your .env file:**
```env
VITE_API_URL=http://localhost:5000
```

**Install dependencies and run:**
```bash
npm install
npm run dev
```

✅ **Expected output:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Visit [http://localhost:5173](http://localhost:5173) — you should see the FactGuard UI! 🎉

---

## Testing

### Test 1: Backend Health Check
```bash
curl http://localhost:5000
```
Should return: `{ "status": "FactGuard API is live" }`

### Test 2: Test with Mock Mode (No API Costs)

The default `VERIFICATION_MODE=mock` uses fake verdicts for testing.

1. Open [http://localhost:5173](http://localhost:5173)
2. Drag & drop a PDF (or use test data)
3. Click **Analyze**
4. You should get instant results with mock verdicts ⚡

**Test claims that work in mock mode:**
- "Google was founded" → Verified
- "OpenAI was founded in 2010" → False
- "Elon Musk is CEO of Apple" → False

### Test 3: Switch to Live Verification

Once confident, you can use **real APIs**:

**In backend/.env, change:**
```env
VERIFICATION_MODE=demo
```

Now the app will:
1. Extract claims from PDFs using Groq
2. Search the web using Tavily
3. Verify using Groq Llama 3.3

⚠️ **Note:** This uses API calls, but costs are minimal (Groq is free, Tavily free tier is 1000/month).

### Test 4: Try with Your Own PDF

1. Find a PDF with facts/claims
2. Upload it to [http://localhost:5173](http://localhost:5173)
3. Wait for results (30-120 seconds depending on PDF length)
4. Check the report for verified/inaccurate/false claims

---

## Production Deployment

### Deploy Backend to Render

#### Prerequisites:
- GitHub repository with your code pushed
- Render account

#### Steps:

1. **Go to [render.com/dashboard](https://render.com/dashboard)**
2. Click **New** → **Web Service**
3. **Connect Your GitHub Repository**
   - Click "Connect account" if first time
   - Select your `factguard` repo
4. **Configure the service:**
   - **Name:** `factguard-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `backend`
5. **Add Environment Variables** (click "Add Environment Variable"):
   - `GROQ_API_KEY` = your_groq_key
   - `TAVILY_API_KEY` = your_tavily_key
   - `MONGODB_URI` = your_mongodb_uri (optional)
   - `FRONTEND_URL` = https://your-vercel-app.vercel.app (update after Vercel deploy)
   - `PORT` = `5000`
   - `VERIFICATION_MODE` = `demo` (or `production`)
6. **Click "Create Web Service"** — Render will deploy! 🚀

⏰ **Deployment takes 3-5 minutes.** Once done, Render gives you a URL like:
```
https://factguard-api.onrender.com
```

✅ **Test:** Visit `https://factguard-api.onrender.com/` — should return the JSON response.

---

### Deploy Frontend to Vercel

#### Prerequisites:
- Your backend is deployed to Render (get the URL from above)

#### Steps:

1. **Go to [vercel.com](https://vercel.com)**
2. Click **Add New...** → **Project**
3. **Import Your GitHub Repository**
   - Select your `factguard` repo
4. **Configure the project:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default, should auto-detect)
5. **Add Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://factguard-api.onrender.com` (your Render backend URL)
6. **Click "Deploy"** — Vercel deploys! 🚀

⏰ **Deployment takes 2-3 minutes.** Once done, you get a URL like:
```
https://factguard.vercel.app
```

✅ **Test:** Visit your Vercel URL — upload a PDF and verify it works!

---

### Update Backend's Frontend URL

Now that your frontend is live, update the backend to allow CORS from your frontend:

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click your `factguard-api` service
3. Click **Environment** → Edit `FRONTEND_URL`
4. Change to your Vercel URL: `https://your-app.vercel.app`
5. **Save** — Render restarts automatically

---

## Troubleshooting

### Backend Issues

#### ❌ "GROQ_API_KEY is not set"
**Solution:** Check your `.env` file in the `backend/` folder. Ensure `GROQ_API_KEY=` is filled in (not empty).

```bash
cat backend/.env | grep GROQ_API_KEY
```

#### ❌ "ECONNREFUSED - Cannot connect to MongoDB"
**Solution:** MongoDB is optional. If you don't have a URI, remove the line from `.env`. The app will work without it (just won't store reports).

#### ❌ "EADDRINUSE - Port 5000 already in use"
**Solution:** Change the port:
```bash
PORT=5001 npm run dev
```

#### ❌ "PDF extraction failed"
**Solution:** Ensure the PDF is text-based, not a scanned image. Try with a different PDF.

---

### Frontend Issues

#### ❌ "Backend is offline" warning
**Solution:** Check that:
1. Backend is running (`npm run dev` in backend folder)
2. `VITE_API_URL` in `frontend/.env` matches your backend URL
3. No firewall blocking localhost:5000

#### ❌ "CORS error" on upload
**Solution:** Ensure backend's `FRONTEND_URL` matches your frontend URL:
```env
# In backend/.env
FRONTEND_URL=http://localhost:5173  # local
FRONTEND_URL=https://your-app.vercel.app  # production
```

#### ❌ "Vite dev server not starting"
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Deployment Issues

#### ❌ "Render deployment failed"
**Solution:**
1. Check the Render logs: Dashboard → Service → **Logs**
2. Common issues:
   - Missing `buildCommand` or `startCommand` in `render.yaml`
   - Environment variable not set
   - Node.js version too old

#### ❌ "Frontend can't reach backend after deployment"
**Solution:**
1. Check that `VITE_API_URL` in Vercel points to your Render URL
2. Verify backend `FRONTEND_URL` is set to your Vercel URL
3. Test directly: `curl https://your-render-backend.onrender.com/`

---

## 🎉 You're Done!

Your FactGuard instance is now live! 

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://factguard-api.onrender.com

Share the frontend URL with others to use your fact-checking app!

---

## Next Steps

- **[Create a Demo Video](./DEMO_VIDEO.md)** — Record a 30-second walkthrough
- **[Check the README](./README.md)** — Full project documentation
- **[GitHub Issues](https://github.com/your-username/factguard/issues)** — Report bugs or suggest features
