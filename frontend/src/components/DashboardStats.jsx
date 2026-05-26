import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';

export default function DashboardStats({
  filename,
  total_claims,
  verified,
  inaccurate,
  false_count,
  unverifiable,
  accuracy_score,
  processing_time_seconds,
}) {
  const stats = [
    {
      icon: CheckCircle,
      label: 'Verified',
      value: verified,
      color: 'from-green-500/20 to-emerald-500/20',
      text: 'text-green-400',
      border: 'border-green-700',
    },
    {
      icon: AlertCircle,
      label: 'Inaccurate',
      value: inaccurate,
      color: 'from-yellow-500/20 to-amber-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-700',
    },
    {
      icon: XCircle,
      label: 'False',
      value: false_count,
      color: 'from-red-500/20 to-rose-500/20',
      text: 'text-red-400',
      border: 'border-red-700',
    },
    {
      icon: Zap,
      label: 'Unverifiable',
      value: unverifiable,
      color: 'from-purple-500/20 to-indigo-500/20',
      text: 'text-purple-400',
      border: 'border-purple-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Fact-Check Report</h1>
            <p className="text-slate-400 text-lg mb-4">{filename}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={18} />
                <span>
                  Processed <span className="font-semibold text-white">{processing_time_seconds}s</span> ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Target size={18} />
                <span>
                  {total_claims} <span className="font-semibold text-white">Claims</span> analyzed
                </span>
              </div>
            </div>
          </div>

          {/* Accuracy Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-brand-primary to-brand-hover rounded-xl p-6 shadow-lg min-w-32 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award size={24} />
              <span className="text-3xl font-bold text-white">{accuracy_score}%</span>
            </div>
            <p className="text-xs text-white/80 font-semibold uppercase tracking-wider">
              Accuracy Score
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ translateY: -4 }}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-xl p-6 shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`${stat.text}`} size={28} />
                <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">
                  {Math.round((stat.value / total_claims) * 100)}% of total
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Breakdown Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-white mb-6">Verdict Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Verified', value: verified, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
            { label: 'Inaccurate', value: inaccurate, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500/20' },
            { label: 'False', value: false_count, color: 'from-red-500 to-rose-500', bg: 'bg-red-500/20' },
            { label: 'Unverifiable', value: unverifiable, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-500/20' },
          ].map((item, idx) => {
            const percentage = total_claims > 0 ? (item.value / total_claims) * 100 : 0;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="text-slate-400 text-sm">
                    {item.value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Summary Text */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-white mb-4">📊 Summary</h3>
        <div className="space-y-3 text-slate-300">
          <p className="leading-relaxed">
            Out of <span className="text-white font-semibold">{total_claims}</span> claims analyzed:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">✓</span>
              <span>
                <span className="text-white font-semibold">{verified}</span> claim{verified !== 1 ? 's' : ''} were{' '}
                <span className="text-green-400 font-semibold">verified</span> with supporting evidence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold mt-0.5">⚠</span>
              <span>
                <span className="text-white font-semibold">{inaccurate}</span> claim{inaccurate !== 1 ? 's' : ''} were marked as{' '}
                <span className="text-yellow-400 font-semibold">inaccurate</span> or partially misleading
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span>
                <span className="text-white font-semibold">{false_count}</span> claim{false_count !== 1 ? 's' : ''} were determined to be{' '}
                <span className="text-red-400 font-semibold">false</span>
              </span>
            </li>
            {unverifiable > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold mt-0.5">?</span>
                <span>
                  <span className="text-white font-semibold">{unverifiable}</span> claim{unverifiable !== 1 ? 's' : ''} could not be{' '}
                  <span className="text-purple-400 font-semibold">verified</span>
                </span>
              </li>
            )}
          </ul>
          <p className="mt-4 pt-4 border-t border-slate-700 text-sm italic">
            Overall accuracy score: <span className="text-brand-primary font-bold">{accuracy_score}%</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
