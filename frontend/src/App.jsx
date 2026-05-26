import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import Loader from './components/Loader';
import DashboardStats from './components/DashboardStats';
import PDFPreview from './components/PDFPreview';
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
        timeout: 180000, // 3 minute timeout
      });

      console.log('[App] Analysis response:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      setReport(response.data);
      setStatus('done');
    } catch (err) {
      console.error('[App] Analysis error:', err);
      
      let errorMessage = err.response?.data?.error || err.message || 'An error occurred';

      // Add helpful hints for common errors
      if (err.code === 'ECONNABORTED') {
        errorMessage = '⏱️ Request timed out. The PDF might be very large or the API is slow. Try:\n• A smaller PDF\n• Checking your internet connection\n• Waiting a moment and trying again';
      } else if (err.message?.includes('timeout')) {
        errorMessage = '⏱️ Analysis took too long. Try:\n• A PDF with fewer pages\n• A PDF with fewer claims\n• Checking backend server status';
      } else if (err.response?.status === 400) {
        errorMessage = '❌ ' + errorMessage;
      } else if (err.response?.status === 500) {
        errorMessage = '🔧 Server error. The backend might be down.\n\nTroubleshooting:\n• Check that backend is running\n• Check that API keys are set correctly\n• Try again in a few moments';
      } else if (!err.response) {
        errorMessage = '🔌 Cannot connect to backend. Make sure:\n• Backend is running (npm run dev in backend folder)\n• VITE_API_URL in .env matches your backend URL\n• No firewall is blocking localhost:5000';
      } else {
        errorMessage = `${err.response?.status || 'Unknown'} error: ${errorMessage}`;
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 sm:py-12"
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
              className="flex flex-col items-center justify-center py-16"
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
              className="space-y-8 pb-8"
            >
              {/* PDF Preview - Show extracted text */}
              {report.extracted_text && (
                <PDFPreview
                  extractedText={report.extracted_text}
                  filename={report.filename}
                />
              )}

              {/* Dashboard Stats - Professional overview */}
              {report.total_claims > 0 && (
                <DashboardStats
                  filename={report.filename}
                  total_claims={report.total_claims}
                  verified={report.verified}
                  inaccurate={report.inaccurate}
                  false_count={report.false_count}
                  unverifiable={report.unverifiable || 0}
                  accuracy_score={report.accuracy_score || 0}
                  processing_time_seconds={report.processing_time_seconds || 0}
                />
              )}

              {/* Detailed Results Table */}
              {report.total_claims > 0 && (
                <ResultsTable claims={report.claims} />
              )}

              {/* No claims found message */}
              {report.total_claims === 0 && report.message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 text-center"
                >
                  <p className="text-slate-300 text-lg mb-2">📋 {report.message}</p>
                  <p className="text-slate-500 text-sm">Try a document with more factual claims like statistics, dates, or specific assertions.</p>
                </motion.div>
              )}

              {/* API Rate Limit Warning */}
              {report.total_claims > 0 && report.claims?.every(c => c.status === 'Unverifiable' || c.status === 'Error') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border border-yellow-700 rounded-xl p-6"
                >
                  <h3 className="text-yellow-400 font-bold mb-3 text-lg">⚠️ Verification Temporarily Unavailable</h3>
                  <p className="text-yellow-300 text-sm mb-4">
                    {report.total_claims} claims were extracted but verification failed, likely due to API rate limits.
                  </p>
                  <p className="text-yellow-300/70 text-xs mb-4">
                    💡 Solutions: Try again in a few minutes, or upgrade your API plan for unlimited verification.
                  </p>
                  <ResultsTable claims={report.claims} />
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Analyze Another Document
                </button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-6"
            >
              <div className="w-full max-w-2xl bg-red-900/20 border border-red-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Analysis Failed
                    </h3>
                    <p className="text-red-300 text-sm mb-3 whitespace-pre-wrap">{error}</p>
                    <div className="text-xs text-red-400/70 space-y-1 bg-red-950/30 p-3 rounded mt-3">
                      <p>💡 <strong>Quick tips:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Backend running? → <code className="bg-red-950 px-1 rounded">npm run dev</code> in backend/</li>
                        <li>API keys set? → Check backend/.env (GROQ_API_KEY, TAVILY_API_KEY)</li>
                        <li>Text-based PDF? → Not a scanned image</li>
                        <li>Has facts? → PDFs with stats, dates, figures work best</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-2xl">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300"
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

      <footer className="w-full border-t border-slate-700/60 bg-slate-900/60 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-white font-bold mb-2 text-sm">FactGuard</h3>
              <p className="text-slate-400 text-xs leading-relaxed">AI-powered fact-checking for the modern web.</p>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-xs mb-2">Features</h4>
              <ul className="text-slate-400 text-xs space-y-1">
                <li><a href="#" className="hover:text-slate-200 transition">PDF Analysis</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Real-time Verification</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Web Search Integration</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-xs mb-2">Resources</h4>
              <ul className="text-slate-400 text-xs space-y-1">
                <li><a href="#" className="hover:text-slate-200 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">API Reference</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-300 font-semibold text-xs mb-2">Legal</h4>
              <ul className="text-slate-400 text-xs space-y-1">
                <li><a href="#" className="hover:text-slate-200 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Terms</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-4 text-center">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} FactGuard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
