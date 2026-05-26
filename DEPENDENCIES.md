# 📦 FactGuard Dependencies

This document lists all project dependencies for both backend and frontend.

---

## Backend Dependencies

**Node.js Version:** 18.0.0 or higher

Located in: `backend/package.json`

### Production Dependencies

```
@anthropic-ai/sdk@^0.24.3       — Anthropic Claude API (for future use)
axios@^1.6.2                     — HTTP client for API requests
cors@^2.8.5                      — Cross-Origin Resource Sharing middleware
dotenv@^16.3.1                   — Environment variable loader
express@^4.18.2                  — Web framework
express-async-errors@^3.1.1      — Async error handling middleware
groq-sdk@^1.2.0                  — Groq API SDK (Llama 3.3 access)
mongodb@^7.2.0                   — MongoDB driver
mongoose@^8.0.3                  — MongoDB ODM
multer@^1.4.5-lts.1              — File upload middleware
pdf-parse@^1.1.1                 — PDF text extraction
```

### Development Dependencies

```
nodemon@^3.0.2                   — Auto-restart on file changes
```

---

## Frontend Dependencies

**Node.js Version:** 18.0.0 or higher

Located in: `frontend/package.json`

### Production Dependencies

```
react@^18                         — React framework
react-dom@^18                     — React DOM renderer
axios@^1.x                        — HTTP client
framer-motion@^x.x.x              — Animation library
tailwindcss@^3.x                  — Utility-first CSS framework
lucide-react@^x.x.x               — Icon library
react-dropzone@^x.x.x             — Drag-and-drop file upload
```

### Development Dependencies (via Vite)

```
@vitejs/plugin-react@^4.x         — React plugin for Vite
vite@^5.x                         — Frontend build tool
tailwindcss@^3.x                  — CSS framework
postcss@^8.x                      — CSS processor
autoprefixer@^10.x                — PostCSS plugin for vendor prefixes
```

---

## API Dependencies (External Services)

These are cloud services, not npm packages. Set them up in your `.env` file.

### 1. Groq API (Required)
- **Purpose:** AI model for claim extraction and verification
- **Model:** Llama 3.3 70B
- **Cost:** Free tier with unlimited usage
- **Setup:** [console.groq.com/keys](https://console.groq.com/keys)
- **Environment Variable:** `GROQ_API_KEY`

### 2. Tavily Search API (Recommended)
- **Purpose:** Web search for fact verification
- **Cost:** Free tier (1,000 searches/month)
- **Setup:** [tavily.com](https://tavily.com)
- **Environment Variable:** `TAVILY_API_KEY`

### 3. MongoDB (Optional)
- **Purpose:** Store fact-check reports persistently
- **Cost:** Free tier (M0 cluster, 512MB storage)
- **Setup:** [mongodb.com/atlas](https://mongodb.com/atlas)
- **Environment Variable:** `MONGODB_URI`

---

## Deployment Services

These are platform services, not npm packages.

### Render (Backend Hosting)
- **Purpose:** Host Node.js Express API
- **Cost:** Free tier available ($0 for small projects, sleeps after 15 min inactivity)
- **Setup:** [render.com](https://render.com)
- **Supports:** Auto-deploy from GitHub

### Vercel (Frontend Hosting)
- **Purpose:** Host React + Vite frontend
- **Cost:** Free tier available
- **Setup:** [vercel.com](https://vercel.com)
- **Supports:** Auto-deploy from GitHub, serverless functions (if needed)

---

## Installation

### Backend

```bash
cd backend
npm install
```

This reads `package.json` and installs all dependencies to `node_modules/`.

Verify:
```bash
npm list  # Show installed packages
```

### Frontend

```bash
cd frontend
npm install
```

---

## Updating Dependencies

### Check for Updates
```bash
npm outdated
```

### Update Dependencies (safe)
```bash
npm update
```

### Update Specific Package
```bash
npm install <package>@latest
```

⚠️ **Warning:** Always test after updating dependencies!

---

## Dependency Conflict Resolution

If you encounter conflicts during `npm install`, try:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Security

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## Size Analysis

### Backend Bundle
- Total: ~150 MB (includes node_modules)
- Key: pdf-parse (~3 MB), mongoose (~10 MB)

### Frontend Bundle  
- After build: ~500 KB (minified + gzipped)
- Runs efficiently on Vercel's CDN

---

## Notes

- **Groq SDK** - Replaces older Claude API calls; uses newer Llama 3.3 model
- **pdf-parse** - Pure JavaScript PDF parser, works in memory (no external tools needed)
- **Framer Motion** - Lightweight animation library (~20 KB gzipped)
- **Tailwind CSS** - Utility CSS generated at build time, ~5 KB after purging unused styles

For more details, see [README.md](./README.md) and [SETUP.md](./SETUP.md).
