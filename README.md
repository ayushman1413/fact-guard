# FactGuard — AI-Powered Fact Checking Agent

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://fact-guards.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=flat-square)](https://github.com/your-username/factguard)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## ⚡ Quick Start (5 Minutes)

### 1. Get API Keys (Free!)
- **Groq API** (Free, unlimited): [console.groq.com/keys](https://console.groq.com/keys) — Sign up with GitHub
- **Tavily Search** (Free tier: 1000 searches/month): [tavily.com](https://tavily.com)

### 2. Local Setup
```bash
# Clone repository
git clone <your-repo-url>
cd factguard

# Backend
cd backend
cp .env.example .env
# Edit .env and add your API keys
npm install
npm run dev  # Runs on http://localhost:5000

# In another terminal, Frontend
cd frontend
cp .env.example .env
# VITE_API_URL should be http://localhost:5000
npm install
npm run dev  # Runs on http://localhost:5173
```

### 3. Test It
- Open [http://localhost:5173](http://localhost:5173)
- Drag & drop a PDF with facts/claims
- Watch the magic happen! 🎩✨

---

## Overview

FactGuard is a production-ready web application that automatically fact-checks PDF documents by extracting factual claims and verifying them against live web data using AI. Upload a PDF, and within seconds, get a detailed report flagging each claim as verified, inaccurate, or false with supporting evidence.

## Features

- **📄 PDF Upload with Drag & Drop** — Intuitive drag-and-drop interface with file preview
- **🤖 AI-Powered Claim Extraction** — Groq Llama 3.3 AI extracts specific factual claims (statistics, dates, financial figures)
- **🌐 Live Web Verification** — Tavily Search API searches the latest web data for each claim in parallel
- **✅ Three-Tier Verdict System** — Claims marked as Verified, Inaccurate, or False with explanations
- **⚡ Parallel Processing** — All claims verified simultaneously for maximum speed
- **📊 Detailed Reports** — Interactive results table with source links and corrections
- **💾 Optional Report Storage** — MongoDB integration for storing and retrieving past reports
- **🚀 Fully Deployed** — Production-ready deployment on Vercel (frontend) + Render (backend)
- **💰 Cost-Effective** — Uses free-tier APIs (Groq unlimited, Tavily 1000/month free)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Dropzone, Lucide Icons |
| **Backend** | Node.js 18+, Express.js, Multer, pdf-parse |
| **AI & Search** | Groq API (Llama 3.3 70B), Tavily Search REST API |
| **Database** | MongoDB Atlas (optional) with Mongoose |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  React UI (Vite) - Drag & Drop Upload - Results Table  │
└──────────────────────┬──────────────────────────────────┘
                       │ FormData (PDF)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                BACKEND — Express API                    │
│  (Render)  POST /api/factcheck                          │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐   ┌──────────┐   ┌──────────┐
   │ Multer │   │ pdf-parse│   │ Groq API │
   │  (PDF) │──▶│(Extract) │──▶│(Llama 3.3│
   └────────┘   │  Text    │   │ Extract) │
                └──────────┘   └──────────┘
                                    │
                                    │ Claims Array
                                    ▼
        ┌───────────────────────────────────────────┐
        │  Promise.all() - Parallel Verification    │
        └──────────┬───────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  ┌──────────────┐     ┌────────────┐
  │ Tavily Search│     │ Groq API   │
  │ (Web Search) │────▶│ (Llama 3.3 │
  └──────────────┘     │ Verify)    │
                       └────────────┘
                            │
                            │ Verdict
                            ▼
                       ┌──────────────┐
                       │  MongoDB     │
                       │  (Optional)  │
                       └──────────────┘
                            │
                            │ JSON Report
                            ▼
                       └─ Return to Client
```

## Local Development Setup

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm, yarn, or pnpm
- A Render account (for backend deployment)
- A Vercel account (for frontend deployment)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your API keys
npm run dev            # Runs on localhost:5000
```

**Required Environment Variables:**
```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
MONGODB_URI=your_mongodb_uri (optional)
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL=http://localhost:5000
npm run dev            # Runs on localhost:5173
```

## Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `GROQ_API_KEY` | Groq API key for Llama 3.3 AI (free tier: unlimited) | [console.groq.com](https://console.groq.com/keys) |
| `TAVILY_API_KEY` | Tavily Search API for web lookup (1000 searches/month free) | [tavily.com](https://tavily.com) |
| `MONGODB_URI` | MongoDB Atlas connection string (optional, app works without it) | [mongodb.com/atlas](https://mongodb.com/atlas) |
| `FRONTEND_URL` | Backend CORS origin for frontend domain (Render → Vercel) | Your Vercel deployment URL |
| `VITE_API_URL` | Frontend env var pointing to backend API URL | Your Render backend URL |

## Deployment Guide

### Deploy Backend to Render

1. Push your repository to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo and select the `backend` directory as the root
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Under **Environment**, add all variables from `.env.example`:
   - `ANTHROPIC_API_KEY`
   - `TAVILY_API_KEY`
   - `MONGODB_URI` (optional)
   - `FRONTEND_URL` (your Vercel deployment URL)
7. Deploy — grab the backend URL (e.g., `https://factguard-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your GitHub repo
3. **Framework Preset:** Vite
4. **Root Directory:** `frontend`
5. **Environment Variables:**
   - `VITE_API_URL` = `https://factguard-api.onrender.com` (your Render URL)
6. Deploy — your frontend is live
7. Update backend `FRONTEND_URL` to match your Vercel URL in Render dashboard

## API Endpoints

### Health Check
```http
GET /
```
**Response:**
```json
{ "status": "FactGuard API is live" }
```

### Fact Check Document
```http
POST /api/factcheck
Content-Type: multipart/form-data

file: <PDF file>
```

**Success Response (200):**
```json
{
  "filename": "document.pdf",
  "total_claims": 5,
  "verified": 3,
  "inaccurate": 1,
  "false_count": 1,
  "processed_at": "2024-01-15T10:30:00.000Z",
  "claims": [
    {
      "claim": "The Earth's population in 2024 is 8 billion people.",
      "status": "Verified",
      "explanation": "Current estimates confirm global population of approximately 8 billion.",
      "correct_fact": "",
      "source": "https://worldpopulationreview.com"
    },
    {
      "claim": "COVID-19 was first detected in January 2019.",
      "status": "Inaccurate",
      "explanation": "COVID-19 cases were first detected in late 2019, not 2019.",
      "correct_fact": "First confirmed cases reported December 2019.",
      "source": "https://who.int"
    },
    {
      "claim": "The moon is made of cheese.",
      "status": "False",
      "explanation": "This is a common myth. The moon is a rocky body, not cheese.",
      "correct_fact": "The moon is a rocky, airless satellite composed of regolith and bedrock.",
      "source": "https://nasa.gov"
    }
  ]
}
```

**Error Response (400/500):**
```json
{ "error": "PDF has no extractable text. Please use a text-based PDF, not a scanned image." }
```

## How to Get API Keys

### 1. Groq API Key (Recommended - Free & Unlimited)
- Go to [console.groq.com](https://console.groq.com/keys)
- Sign up or log in with GitHub
- Navigate to **API Keys**
- Create a new key and copy it
- **No credit card required, completely free tier**

### 2. Tavily Search API Key
- Visit [tavily.com](https://tavily.com)
- Sign up for free (includes 1,000 searches/month)
- Go to your dashboard and copy the API key
- Free tier is sufficient for testing; upgrade for production volume

### 3. MongoDB URI (Optional)
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create a free account
- Create a new cluster (M0 free tier)
- Get the connection string and replace `<username>` and `<password>`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/factguard?retryWrites=true&w=majority`

## Error Handling

| Error | HTTP Status | Solution |
|-------|------------|----------|
| Non-PDF file uploaded | 400 | Only PDF files are supported |
| File exceeds 10MB | 400 | Reduce file size and try again |
| Scanned PDF (image only) | 400 | Use text-based PDFs only |
| Missing API key | 500 | Check backend environment variables |
| Tavily search fails | 200 (marked Unverifiable) | Claim marked as unverifiable, process continues |
| MongoDB unavailable | 200 | Report returned, just not stored in DB |

## Performance Characteristics

- **Processing Time:** 30–120 seconds (depends on PDF length and claim count)
- **Claim Verification:** All claims processed in **parallel** using Promise.all()
- **Memory:** Uses in-memory file storage (no disk writes)
- **Scaling:** Can handle concurrent requests; horizontal scaling supported

## Project Structure

```
factguard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── factcheck.js
│   │   ├── services/
│   │   │   ├── pdfExtractor.js
│   │   │   ├── claimExtractor.js
│   │   │   ├── webSearcher.js
│   │   │   └── verifier.js
│   │   ├── models/
│   │   │   └── Report.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── ResultsTable.jsx
│   │   │   ├── ClaimRow.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Verify all API keys are correctly configured

## Future Enhancements

- [ ] Support for multiple document formats (DOCX, TXT, etc.)
- [ ] Advanced filtering and sorting in results table
- [ ] Report export to PDF
- [ ] Custom API integration for domain-specific sources
- [ ] User accounts and report history
- [ ] Real-time streaming results
- [ ] Multi-language support
- [ ] Batch processing for multiple documents

---

**Built with ❤️ using Claude AI, Tavily Search, and the MERN Stack**
