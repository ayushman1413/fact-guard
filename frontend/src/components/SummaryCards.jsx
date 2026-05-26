import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, XCircle, Calendar } from 'lucide-react';

export default function SummaryCards({
  filename,
  total_claims,
  verified,
  inaccurate,
  false_count,
  processed_at,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cards = [
    {
      label: 'Total Claims',
      value: total_claims,
      icon: FileText,
      bg: 'from-slate-600/20 via-slate-500/10 to-slate-700/5',
      border: 'border-slate-500/30',
      iconBg: 'bg-slate-500/20',
      iconColor: 'text-slate-400',
      barColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
    },
    {
      label: 'Verified',
      value: verified,
      icon: CheckCircle,
      bg: 'from-green-600/20 via-emerald-500/10 to-emerald-700/5',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      barColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
    },
    {
      label: 'Inaccurate',
      value: inaccurate,
      icon: AlertCircle,
      bg: 'from-amber-600/20 via-orange-500/10 to-orange-700/5',
      border: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      barColor: 'bg-gradient-to-r from-orange-500 to-amber-600',
    },
    {
      label: 'False',
      value: false_count,
      icon: XCircle,
      bg: 'from-red-600/20 via-rose-500/10 to-rose-700/5',
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
      barColor: 'bg-gradient-to-r from-rose-500 to-red-600',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* Header Card with file info */}
      <motion.div
        variants={headerVariants}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 hover:border-brand-primary/30 transition-all duration-300"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-brand-primary/30 to-brand-hover/20 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Document</p>
              <p className="text-lg font-bold text-white truncate max-w-xs">
                {filename}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar className="w-4 h-4 text-brand-primary/60" />
            <span>{new Date(processed_at).toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`group relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.bg} backdrop-blur-sm hover:border-opacity-60 hover:shadow-lg hover:shadow-${card.label.includes('Verified') ? 'emerald' : card.label.includes('False') ? 'rose' : card.label.includes('Inaccurate') ? 'orange' : 'slate'}-500/20 transition-all duration-300`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${card.bg}`}></div>
              
              {/* Top bar indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${card.barColor}`}></div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                      {card.label}
                    </p>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      className="relative"
                    >
                      <p className="text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        {card.value}
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], y: [0, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2 }}
                    className={`${card.iconBg} p-3 rounded-lg flex-shrink-0`}
                  >
                    <Icon className={`${card.iconColor} w-6 h-6`} />
                  </motion.div>
                </div>

                {/* Progress bar (if not total) */}
                {card.label !== 'Total Claims' && total_claims > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(card.value / total_claims) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 + 0.4 }}
                        className={card.barColor}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {((card.value / total_claims) * 100).toFixed(0)}% of claims
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
