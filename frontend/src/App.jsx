import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import Loader from './components/Loader';
import SummaryCards from './components/SummaryCards';
import ResultsTable from './components/ResultsTable';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Startup health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_URL}/`, {
          timeout: 5000,
        });
        console.log('[App] Backend is online:', response.data);
      } catch (err) {
        console.warn('[App] Backend health check failed:', {
          url: API_URL,
          error: err.message,
          code: err.code,
        });
      }
    };

    checkBackend();
  }, [API_URL]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('[App] Starting analysis for:', file.name);
      const response = await axios.post(`${API_URL}/api/factcheck`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minute timeout
      });

      console.log('[App] Analysis response:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      setReport(response.data);
      setStatus('done');
    } catch (err) {
      console.error('[App] Analysis error:', err);
      
      let errorMessage =
        err.response?.data?.error || err.message || 'An error occurred';

      // Add helpful hints for common errors
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Try a smaller PDF or check your internet connection.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Analysis is taking too long. Try a PDF with fewer pages or claims.';
      } else if (!errorMessage) {
        errorMessage = `${err.response?.status || 'Unknown'} error from server. Check that the backend is running.`;
      }

      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setReport(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-96"
            >
              <UploadZone
                onFileSelect={handleFileSelect}
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
              />
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-96"
            >
              <Loader />
            </motion.div>
          )}

          {status === 'done' && report && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <SummaryCards
                filename={report.filename}
                total_claims={report.total_claims}
                verified={report.verified}
                inaccurate={report.inaccurate}
                false_count={report.false_count}
                processed_at={report.processed_at}
              />

              {report.total_claims > 0 && (
                <ResultsTable claims={report.claims} />
              )}

              {report.total_claims === 0 && report.message && (
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-300 text-lg">{report.message}</p>
                </div>
              )}

              {report.total_claims > 0 && report.claims?.every(c => c.status === 'Unverifiable' || c.status === 'Error') && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                  <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Verification Temporarily Unavailable</h3>
                  <p className="text-yellow-300 text-sm mb-3">
                    {report.total_claims} claims were extracted but verification failed (likely API rate limit).
                  </p>
                  <p className="text-yellow-300/70 text-xs mb-3">
                    Try again in a few minutes, or upgrade your API plan for unlimited verification.
                  </p>
                  <ResultsTable claims={report.claims} />
                </div>
              )}

              {report.message && !report.message.includes('No specific') && (
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-300 text-lg">{report.message}</p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Analyze Another Document
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-96 gap-6"
            >
              <div className="w-full max-w-2xl bg-red-900/20 border border-red-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Analysis Failed
                    </h3>
                    <p className="text-red-300 text-sm mb-3">{error}</p>
                    <div className="text-xs text-red-400/70 space-y-1 bg-red-950/30 p-3 rounded mt-3">
                      <p>💡 <strong>Troubleshooting tips:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Make sure the PDF contains readable text (not scanned images)</li>
                        <li>Ensure the backend server is running: <code className="bg-red-950 px-1 rounded">npm run dev</code> in the backend folder</li>
                        <li>Check that API keys are set in backend/.env (GROQ_API_KEY, TAVILY_API_KEY)</li>
                        <li>Try with a PDF that has statistics, dates, or specific facts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-2xl">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setStatus('idle');
                  }}
                  className="flex-1 border border-slate-600 text-slate-300 font-medium py-3 rounded-lg hover:bg-slate-800/30 transition"
                >
                  Upload New File
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-slate-700 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-slate-400 text-sm">
            FactGuard © 2024 — AI-Powered Fact-Checking
          </p>
        </div>
      </footer>
    </div>
  );
}
