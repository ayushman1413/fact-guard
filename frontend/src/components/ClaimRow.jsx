import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ClaimRow({
  index,
  claim,
  status,
  explanation,
  correct_fact,
  source,
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Verified':
        return 'from-emerald-600/20 to-emerald-700/5 border-emerald-500/30 hover:border-emerald-500/50';
      case 'Inaccurate':
        return 'from-orange-600/20 to-orange-700/5 border-orange-500/30 hover:border-orange-500/50';
      case 'False':
        return 'from-rose-600/20 to-rose-700/5 border-rose-500/30 hover:border-rose-500/50';
      default:
        return 'from-slate-600/20 to-slate-700/5 border-slate-500/30 hover:border-slate-500/50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'Inaccurate':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'False':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${getStatusColor()} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
    >
      {/* Gradient accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        status === 'Verified' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
        status === 'Inaccurate' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
        status === 'False' ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
        'bg-gradient-to-r from-slate-500 to-slate-600'
      }`}></div>

      <div className="relative p-6">
        {/* Header with index and status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center"
            >
              <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Claim
              </p>
              <p className="text-base font-semibold text-white line-clamp-2 hover:line-clamp-none cursor-default" title={claim}>
                {claim}
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            className="flex-shrink-0"
          >
            {getStatusIcon()}
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <StatusBadge status={status} />
        </div>

        {/* Explanation section */}
        <div className="mb-4 pb-4 border-b border-white/5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            Analysis
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Correct fact section (if available) */}
        {correct_fact && correct_fact.trim() && (
          <div className="mb-4 pb-4 border-b border-white/5 bg-white/5 rounded-lg p-3">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Correct Information
            </p>
            <p className="text-sm text-slate-200 italic">
              {correct_fact}
            </p>
          </div>
        )}

        {/* Source Link */}
        {source && source.trim() && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Source Reference</span>
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 hover:border-brand-primary/50 text-brand-primary hover:text-brand-hover transition-all duration-300 text-xs font-semibold group/link"
            >
              <span>View Source</span>
              <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:translate-y-1 transition-transform" />
            </a>
          </div>
        )}

        {!source || !source.trim() && (
          <div className="text-xs text-slate-600">
            No source available
          </div>
        )}
      </div>
    </motion.div>
  );
}
