import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-b from-slate-900 to-slate-900/80 border-b border-slate-700 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-brand-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-hover bg-clip-text text-transparent">
            FactGuard
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          AI-Powered Truth Layer for Documents
        </p>
      </div>
    </motion.header>
  );
}
