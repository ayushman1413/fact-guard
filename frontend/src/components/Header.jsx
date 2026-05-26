import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, #6366F1 1px, transparent 1px), linear-gradient(#6366F1 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top bar with logo and tagline */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-hover rounded-lg blur opacity-75"></div>
              <div className="relative bg-gradient-to-br from-brand-primary to-brand-hover p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-brand-primary to-brand-hover bg-clip-text text-transparent leading-tight">
                FactGuard
              </h1>
              <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mt-1">
                Truth Verification Platform
              </p>
            </div>
          </div>
          
          {/* Badge */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="hidden sm:flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-semibold">AI Active</span>
          </motion.div>
        </div>
        
        {/* Subtitle with features */}
        <div className="flex flex-col gap-2">
          <p className="text-xl text-slate-200 font-light">
            AI-Powered Fact Checking and Truth Verification
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Lightning Fast</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <Shield className="w-4 h-4 text-green-400" />
              <span>Accurate Results</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>
    </motion.header>
  );
}
