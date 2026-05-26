# 🛡️ FactGuard — AI-Powered Fact-Checking Agent

FactGuard is a high-performance, production-ready web application designed to automatically extract and verify factual claims from PDF documents in real-time. By leveraging state-of-the-art LLMs (Llama 3.3 70B via Groq) and live web searches (Tavily Search API), FactGuard flags claims as **Verified**, **Inaccurate**, or **False**, complete with detailed AI-generated explanations, correct figures, and citation links.

## 🚀 Key Features

* **📄 In-Memory PDF Parser** — Upload any text-based PDF via a premium drag-and-drop zone. Content is parsed on the fly without writing temp files to disk.
* **🤖 Smart Claim Extraction** — Extracts dense factual assertions (numbers, percentages, dates, entities, currency) using Llama 3.3.
* **⚡ Parallel Verification Pipeline** — Verifies up to 8 claims concurrently using `Promise.all()` to dramatically reduce loading times.
* **🔍 Local Quick-Filter** — Matches obvious queries and local checks (such as `"Google was founded in 1998"`) instantly without consuming LLM API tokens.
* **🌐 Automated Web-Search Grounding** — Executes Tavily search queries per claim, retrieves multiple web citations, and formats them as structured evidence.
* **🎯 Comprehensive Report Dashboard** — Displays overall document accuracy metrics, processing time, and an interactive filtrable results table.

---

## 🛠️ Technology Stack

| Component              | Technology                                  | Description                                                                 |
| :--------------------- | :------------------------------------------ | :-------------------------------------------------------------------------- |
| **Frontend**     | React 18, Vite, Tailwind CSS, Framer Motion | Single-Page Application with premium transitions and modern aesthetics.     |
| **Backend**      | Node.js, Express, Multer,`pdf-parse`      | Non-blocking asynchronous REST API.                                         |
| **AI Inference** | Groq SDK (Llama 3.3 70B)                    | High-speed structured JSON claim extraction & evidence validation.          |
| **Web Search**   | Tavily REST API                             | Web search engine specialized in returning clean content for LLM grounding. |
| **Database**     | MongoDB Atlas, Mongoose                     | Optional storage layer for persisting and reviewing past analysis reports.  |

---

## 📐 Architecture Workflow

```
                   ┌──────────────────────────────────────┐
                   │             USER BROWSER             │
                   │  React Web App (Upload PDF → Report)  │
                   └──────────────────┬───────────────────┘
                                      │ FormData (PDF)
                                      ▼
                   ┌──────────────────────────────────────┐
                   │             BACKEND API              │
                   │    Express Server (Port 5000)        │
                   └──────────────────┬───────────────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  pdf-parse   │ (Memory text extraction)
                               └──────┬───────┘
                                      │ Raw Text
                                      ▼
                               ┌──────────────┐
                               │  Groq LLM    │ (Extract factual claims)
                               └──────┬───────┘
                                      │ Claims Array
                                      ▼
                   ┌──────────────────────────────────────┐
                   │ Parallel Fact-Checking Loop (stagger)│
                   └──────────────────┬───────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
         ┌──────────────────┐                  ┌──────────────────┐
         │  Tavily Search   │                  │  Local Filter    │
         │ (Retrieve Web    │                  │  (Instant verify │
         │  Citations)      │                  │   without APIs)  │
         └─────────┬────────┘                  └─────────┬────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  Groq LLM    │ (Synthesize verdict)
                               └──────┬───────┘
                                      │ Report JSON
                                      ▼
                   ┌──────────────────────────────────────┐
                   │         Response Returned            │
                   │     (Optional DB persistence)        │
                   └──────────────────────────────────────┘
```

---

## 📦 Directory Structure

```
fact-guard/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Centralized Express error handler
│   │   ├── models/
│   │   │   └── Report.js         # Mongoose schema for persistent reports
│   │   ├── routes/
│   │   │   └── factcheck.js      # Fact check router (Parallel promises + Stagger)
│   │   └── services/
│   │       ├── claimExtractor.js # Groq model extractor
│   │       ├── pdfExtractor.js   # pdf-parse handler
│   │       ├── webSearcher.js    # Tavily Web search service
│   │       └── verifier.js       # Local verification + LLM validation logic
│   ├── .env.example
│   ├── server.js                 # API server initialization
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Modular components (UploadZone, Stats, Results)
│   │   ├── App.jsx               # App routing and layout controller
│   │   ├── index.css             # Tailwind setup and custom theme variables
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── requirements.txt              # Unified dependencies catalog file
└── README.md                     # Comprehensive product guide
```

---

## 🔧 Troubleshooting

#### 1. "Verification failed due to an error" on upload

* **Root Cause:** If Tavily search runs out of monthly requests or the Groq API key is invalid, the verifier fallback triggers.
* **Fix:** Double check your `TAVILY_API_KEY` and `GROQ_API_KEY` in `backend/.env`. If you want to run without live API calls, set `VERIFICATION_MODE=mock`.

#### 2. CORS errors when calling backend

* **Root Cause:** Backend blocks requests originating from outside the allowed origins list.
* **Fix:** Check that the `FRONTEND_URL` in `backend/.env` exactly matches the port or URL of your running React server (e.g. `http://localhost:5173`).

#### 3. No claims found in PDF

* **Root Cause:** Scanned PDFs (image-only documents) do not contain character data.
* **Fix:** Upload text-based, digitally created PDF documents.

---
