import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full relative overflow-hidden flex-shrink-0"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 to-transparent"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, #6366F1 1px, transparent 1px), linear-gradient(#6366F1 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Top bar with logo and badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-hover rounded-lg blur opacity-60"></div>
              <div className="relative bg-gradient-to-br from-brand-primary to-brand-hover p-1.5 sm:p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-brand-primary to-brand-hover bg-clip-text text-transparent leading-tight">
                FactGuard
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                Truth Verification Platform
              </p>
            </div>
          </div>
          
          {/* AI Active badge */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="hidden sm:flex items-center gap-2 bg-green-500/15 border border-green-500/40 px-3 py-1 rounded-full"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-semibold">AI Active</span>
          </motion.div>
        </div>
        
        {/* Subtitle row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-sm sm:text-base text-slate-300 font-light">
            AI-Powered Fact Checking and Truth Verification
          </p>
          <div className="flex gap-3 text-xs sm:text-sm">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 text-slate-400"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Lightning Fast</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 text-slate-400"
            >
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span>Accurate Results</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-brand-primary/60 to-transparent"></div>
    </motion.header>
  );
}
